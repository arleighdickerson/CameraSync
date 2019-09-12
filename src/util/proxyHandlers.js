// @ts-nocheck
// ============================================================================
// (adapted from https://github.com/tvcutsem/proxy-handlers)
// ============================================================================

// (copied from reflect.js)
function isStandardAttribute(name) {
  return /^(get|set|value|writable|enumerable|configurable)$/.test(name);
}

// Adapted from ES5 section 8.10.5
function toPropertyDescriptor(obj) {
  if (Object(obj) !== obj) {
    throw new TypeError(`property descriptor should be an Object, given: ${
      obj}`);
  }
  const desc = {};
  if ('enumerable' in obj) {
    desc.enumerable = !!obj.enumerable;
  }
  if ('configurable' in obj) {
    desc.configurable = !!obj.configurable;
  }
  if ('value' in obj) {
    desc.value = obj.value;
  }
  if ('writable' in obj) {
    desc.writable = !!obj.writable;
  }
  if ('get' in obj) {
    const getter = obj.get;
    if (getter !== undefined && typeof getter !== 'function') {
      throw new TypeError(`${'property descriptor \'get\' attribute must be ' +
      'callable or undefined, given: '}${getter}`);
    }
    desc.get = getter;
  }
  if ('set' in obj) {
    const setter = obj.set;
    if (setter !== undefined && typeof setter !== 'function') {
      throw new TypeError(`${'property descriptor \'set\' attribute must be ' +
      'callable or undefined, given: '}${setter}`);
    }
    desc.set = setter;
  }
  if ('get' in desc || 'set' in desc) {
    if ('value' in desc || 'writable' in desc) {
      throw new TypeError(`${'property descriptor cannot be both a data and an ' +
      'accessor descriptor: '}${obj}`);
    }
  }
  return desc;
}

function isAccessorDescriptor(desc) {
  if (desc === undefined) {return false;}
  return ('get' in desc || 'set' in desc);
}

function isDataDescriptor(desc) {
  if (desc === undefined) {return false;}
  return ('value' in desc || 'writable' in desc);
}

function isGenericDescriptor(desc) {
  if (desc === undefined) {return false;}
  return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
}

function toCompletePropertyDescriptor(desc) {
  const internalDesc = toPropertyDescriptor(desc);
  if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
    if (!('value' in internalDesc)) {
      internalDesc.value = undefined;
    }
    if (!('writable' in internalDesc)) {
      internalDesc.writable = false;
    }
  } else {
    if (!('get' in internalDesc)) {
      internalDesc.get = undefined;
    }
    if (!('set' in internalDesc)) {
      internalDesc.set = undefined;
    }
  }
  if (!('enumerable' in internalDesc)) {
    internalDesc.enumerable = false;
  }
  if (!('configurable' in internalDesc)) {
    internalDesc.configurable = false;
  }
  return internalDesc;
}

/**
 * Returns a fresh property descriptor that is guaranteed
 * to be complete (i.e. contain all the standard attributes).
 * Additionally, any non-standard enumerable properties of
 * attributes are copied over to the fresh descriptor.
 *
 * If attributes is undefined, returns undefined.
 *
 * See also: http://wiki.ecmascript.org/doku.php?id=harmony:proxies_semantics
 */
function normalizeAndCompletePropertyDescriptor(attributes) {
  if (attributes === undefined) {
    return undefined;
  }
  const desc = toCompletePropertyDescriptor(attributes);
  // Note: no need to call FromPropertyDescriptor(desc), as we represent
  // "internal" property descriptors as proper Objects from the start
  Object.keys(attributes, (name) => {
    if (!isStandardAttribute(name)) {
      Object.defineProperty(desc, name, {
        value:        attributes[name],
        writable:     true,
        enumerable:   true,
        configurable: true,
      });
    }
  });

  return desc;
}

// ==========================================================================
// DelegatingHandler
// ==========================================================================
function forward(name) {
  return function forwardArgs(...args) {
    return Reflect[name].apply(undefined, args);
  };
}

function DelegatingHandler() {
}

DelegatingHandler.proxyFor = function proxyFor(target, ...args) {
  return new Proxy(target, Reflect.construct(this, args));
};
DelegatingHandler.revocableProxyFor = function revocableProxyFor(target, ...args) {
  return Proxy.revocable(target, Reflect.construct(this, args));
};

DelegatingHandler.prototype = {
  // fundamental traps
  getOwnPropertyDescriptor: forward('getOwnPropertyDescriptor'),
  getOwnPropertyNames:      forward('getOwnPropertyNames'),
  getOwnPropertyKeys:       forward('getOwnPropertyKeys'),
  getPrototypeOf:           forward('getPrototypeOf'),
  setPrototypeOf:           forward('setPrototypeOf'),
  defineProperty:           forward('defineProperty'),
  deleteProperty:           forward('deleteProperty'),
  preventExtensions:        forward('preventExtensions'),
  apply:                    forward('apply'),

  // derived traps
  has(target, name) {
    let desc = this.getOwnPropertyDescriptor(target, name);
    desc = normalizeAndCompletePropertyDescriptor(desc);
    if (desc !== undefined) {
      return true;
    }
    const proto = this.getPrototypeOf(target);
    if (proto === null) {
      return false;
    }
    return Reflect.has(proto, name);
  },
  hasOwn(target, name) {
    let desc = this.getOwnPropertyDescriptor(target, name);
    desc = normalizeAndCompletePropertyDescriptor(desc);
    return desc !== undefined;
  },
  get(target, name, receiver) {
    let desc = this.getOwnPropertyDescriptor(target, name);
    desc = normalizeAndCompletePropertyDescriptor(desc);
    if (desc === undefined) {
      const proto = this.getPrototypeOf(target);
      if (proto === null) {
        return undefined;
      }
      return Reflect.get(proto, name, receiver);
    }
    if (isDataDescriptor(desc)) {
      return desc.value;
    }
    const getter = desc.get;
    if (getter === undefined) {
      return undefined;
    }
    return desc.get.call(receiver);
  },
  set(target, name, value, receiver) {
    let ownDesc = this.getOwnPropertyDescriptor(target, name);
    ownDesc = normalizeAndCompletePropertyDescriptor(ownDesc);
    if (isDataDescriptor(ownDesc)) {
      if (!ownDesc.writable) {return false;}
    }
    if (isAccessorDescriptor(ownDesc)) {
      if (ownDesc.set === undefined) {return false;}
      ownDesc.set.call(receiver, value);
      return true;
    }
    const proto = this.getPrototypeOf(target);
    if (proto === null) {
      const receiverDesc = Object.getOwnPropertyDescriptor(receiver, name);
      if (isAccessorDescriptor(receiverDesc)) {
        if (receiverDesc.set === undefined) {return false;}
        receiverDesc.set.call(receiver, value);
        return true;
      }
      if (isDataDescriptor(receiverDesc)) {
        if (!receiverDesc.writable) {return false;}
        Object.defineProperty(receiver, name, { value });
        return true;
      }
      if (!Object.isExtensible(receiver)) {return false;}
      Object.defineProperty(receiver, name,
        {
          value,
          writable:     true,
          enumerable:   true,
          configurable: true,
        });
      return true;
    }
    return Reflect.set(proto, name, value, receiver);
  },
  enumerate(target) {
    const result = [];
    const trapResult = this.getOwnPropertyNames(target);
    const l = +trapResult.length;
    for (let i = 0; i < l; i += 1) {
      const name = String(trapResult[i]);
      let desc = this.getOwnPropertyDescriptor(name);
      desc = normalizeAndCompletePropertyDescriptor(desc);
      if (desc !== undefined && desc.enumerable) {
        result.push(name);
      }
    }
    const proto = this.getPrototypeOf(target);
    if (proto === null) {
      return result;
    }
    const parentResult = Reflect.enumerate(proto);
    // TODO: filter out duplicates
    result.concat(parentResult);
    return result;
  },
  keys(target) {
    const trapResult = this.getOwnPropertyNames(target);
    const l = +trapResult.length;
    const result = [];
    for (let i = 0; i < l; i += 1) {
      const name = String(trapResult[i]);
      let desc = this.getOwnPropertyDescriptor(name);
      desc = normalizeAndCompletePropertyDescriptor(desc);
      if (desc !== undefined && desc.enumerable) {
        result.push(name);
      }
    }
    return result;
  },
  construct(target, args) {
    const proto = this.get(target, 'prototype', target);
    let instance;
    if (Object(proto) === proto) {
      instance = Object.create(proto);
    } else {
      instance = {};
    }
    const res = this.apply(target, instance, args);
    if (Object(res) === res) {
      return res;
    }
    return instance;
  },

  // deprecated traps:

  seal(target) {
    let success = this.preventExtensions(target);
    success = !!success; // cast to Boolean
    if (success) {
      const props = this.getOwnPropertyNames(target);
      const l = +props.length;
      for (let i = 0; i < l; i += 1) {
        const name = props[i];
        success = success &&
          this.defineProperty(target, name, { configurable: false });
      }
    }
    return success;
  },
  freeze(target) {
    let success = this.preventExtensions(target);
    success = !!success; // cast to Boolean
    if (success) {
      const props = this.getOwnPropertyNames(target);
      const l = +props.length;
      for (let i = 0; i < l; i += 1) {
        const name = props[i];
        let desc = this.getOwnPropertyDescriptor(target, name);
        desc = normalizeAndCompletePropertyDescriptor(desc);
        if (isAccessorDescriptor(desc)) {
          success = success &&
            this.defineProperty(target, name, {
              writable:     false,
              configurable: false,
            });
        } else if (desc !== undefined) {
          success = success &&
            this.defineProperty(target, name, { configurable: false });
        }
      }
    }
    return success;
  },
  isSealed(target) {
    if (this.isExtensible(target)) {
      return false;
    }
    const props = this.getOwnPropertyNames(target);
    return props.every(function handlePropName(name) {
      return !this.getOwnPropertyDescriptor(target, name).configurable;
    }, this);
  },
  isFrozen(target) {
    if (this.isExtensible(target)) {
      return false;
    }
    const props = this.getOwnPropertyNames(target);
    return props.every(function handlePropName(name) {
      const desc = this.getOwnPropertyDescriptor(target, name);
      return !desc.configurable && ('writable' in desc ? !desc.writable : true);
    }, this);
  },
};

// ==========================================================================
// ForwardingHandler
// ==========================================================================
function ForwardingHandler() {
  DelegatingHandler.call(this); // not strictly necessary
}

ForwardingHandler.prototype = Object.create(DelegatingHandler.prototype);
ForwardingHandler.prototype.get = function get(target, name, receiver) {
  let desc = this.getOwnPropertyDescriptor(target, name);
  desc = normalizeAndCompletePropertyDescriptor(desc);
  if (desc === undefined) {
    const proto = this.getPrototypeOf(target);
    if (proto === null) {
      return undefined;
    }
    return Reflect.get(proto, name, receiver);
  }
  if (isDataDescriptor(desc)) {
    return desc.value;
  }
  const getter = desc.get;
  if (getter === undefined) {
    return undefined;
  }
  return desc.get.call(target);
};
ForwardingHandler.prototype.set = function set(target, name, value, receiver) {
  let ownDesc = this.getOwnPropertyDescriptor(target, name);
  ownDesc = normalizeAndCompletePropertyDescriptor(ownDesc);
  if (isDataDescriptor(ownDesc)) {
    if (!ownDesc.writable) {return false;}
  }
  if (isAccessorDescriptor(ownDesc)) {
    if (ownDesc.set === undefined) {return false;}
    ownDesc.set.call(target, value);
    return true;
  }
  const proto = this.getPrototypeOf(target);
  if (proto === null) {
    const receiverDesc = Object.getOwnPropertyDescriptor(receiver, name);
    if (isAccessorDescriptor(receiverDesc)) {
      if (receiverDesc.set === undefined) {return false;}
      receiverDesc.set.call(target, value);
      return true;
    }
    if (isDataDescriptor(receiverDesc)) {
      if (!receiverDesc.writable) {return false;}
      Object.defineProperty(receiver, name, { value });
      return true;
    }
    if (!Object.isExtensible(receiver)) {return false;}
    Object.defineProperty(receiver, name,
      {
        value,
        writable:     true,
        enumerable:   true,
        configurable: true,
      });
    return true;
  }
  return Reflect.set(proto, name, value, receiver);
};

// ==========================================================================
// VirtualHandler
// ==========================================================================
function abstract(name) {
  return function invoke(...args) {
    throw new TypeError(`${name} not implemented`);
  };
}

function VirtualHandler() {
  DelegatingHandler.call(this); // ¯\_(ツ)_/¯
}

VirtualHandler.prototype = Object.create(DelegatingHandler.prototype);
VirtualHandler.prototype.getOwnPropertyDescriptor = abstract('getOwnPropertyDescriptor');
VirtualHandler.prototype.getOwnPropertyNames = abstract('getOwnPropertyNames');
VirtualHandler.prototype.getOwnPropertyKeys = abstract('getOwnPropertyKeys');
VirtualHandler.prototype.getPrototypeOf = abstract('getPrototypeOf');
VirtualHandler.prototype.setPrototypeOf = abstract('setPrototypeOf');
VirtualHandler.prototype.defineProperty = abstract('defineProperty');
VirtualHandler.prototype.deleteProperty = abstract('deleteProperty');
VirtualHandler.prototype.preventExtensions = abstract('preventExtensions');
VirtualHandler.prototype.apply = abstract('apply');

export { DelegatingHandler, ForwardingHandler, VirtualHandler };
