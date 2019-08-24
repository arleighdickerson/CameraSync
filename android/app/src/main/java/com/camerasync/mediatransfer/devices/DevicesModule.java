package com.camerasync.mediatransfer.devices;

import android.content.Context;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import com.camerasync.util.ConversionUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Consumer;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.Subscribe;

public class DevicesModule extends ReactContextBaseJavaModule {

  public DevicesModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Nonnull
  @Override
  public String getName() {
    return "Devices";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    Arrays.asList(
      DeviceNotFound.E_DEVICE_MISSING,
      DeviceNotFound.E_NO_DEVICES_CONNECTED
    ).forEach(symbol -> {
      constants.put(symbol, symbol);
    });

    Arrays.asList(DeviceEvent.Type.values()).forEach(symbol -> {
      constants.put(symbol.toString(), symbol.toString());
    });

    return constants;
  }


  @Subscribe
  public void handleDeviceEvent(DeviceEvent event) {
    String eventName = event.getType().toString();

    WritableMap params = Arguments.createMap();
    params.putString("type", event.getType().toString());
    params.putBoolean("error", false);
    params.putMap("payload", ConversionUtil.asWritableMap(event.getDevice()));

    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }


  @ReactMethod
  public void fetchAll(Promise p) {
    p.resolve(ConversionUtil.asWritableMap(getUsbManager().getDeviceList()));
  }

  public boolean doWithDevice(String deviceName, Promise p, Consumer<UsbDevice> consumer) {
    try {
      consumer.accept(getDevice(deviceName));
      return true;
    } catch (DeviceNotFound e) {
      p.reject(e.getCode(), e.getMessage(), e, e.getUserInfo());
      return false;
    }
  }

  public UsbDevice getDevice(String key) throws DeviceNotFound {
    if (key == null) {
      return getDevice();
    }

    try {
      return getDeviceOption(key).get();
    } catch (NoSuchElementException e) {
      throw new DeviceNotFound.DeviceNameMissing() {
        @Override
        public String getDeviceName() {
          return key;
        }
      };
    }
  }

  public UsbDevice getDevice() throws DeviceNotFound {
    try {
      return getDeviceOption().get();
    } catch (NoSuchElementException e) {
      throw new DeviceNotFound.NoDevicesConnected();
    }
  }

  public Optional<UsbDevice> getDeviceOption() {
    return getDeviceOption(null);
  }

  public Optional<UsbDevice> getDeviceOption(String key) {
    if (key == null) {
      return getFirstDevice();
    } else {
      return Optional.ofNullable(getUsbManager().getDeviceList().get(key));
    }
  }

  private Optional<UsbDevice> getFirstDevice() {
    Collection<UsbDevice> devices = getUsbManager().getDeviceList().values();
    return devices.isEmpty() ? Optional.empty() : Optional.of(devices.iterator().next());
  }

  public UsbManager getUsbManager() {
    return (UsbManager)
      getReactApplicationContext()
        .getSystemService(Context.USB_SERVICE);
  }

  static abstract class DeviceNotFound extends java.lang.Exception {

    private static final String E_NO_DEVICES_CONNECTED = "E_NO_DEVICES_CONNECTED";
    private static final String E_DEVICE_MISSING = "E_DEVICE_MISSING";

    public abstract String getCode();

    public abstract WritableMap getUserInfo();

    static class NoDevicesConnected extends DeviceNotFound {

      private static final String MESSAGE = "No USB Devices are connected";

      public String getCode() {
        return E_NO_DEVICES_CONNECTED;
      }

      public String getMessage() {
        return MESSAGE;
      }

      @Override
      public WritableMap getUserInfo() {
        return Arguments.createMap();
      }
    }

    static abstract class DeviceNameMissing extends DeviceNotFound {

      public abstract String getDeviceName();

      public String getMessage() {
        return "No USB device named \"" + getDeviceName() + "\" is connected";
      }

      @Override
      public String getCode() {
        return E_DEVICE_MISSING;
      }

      @Override
      public WritableMap getUserInfo() {
        WritableMap userInfo = Arguments.createMap();
        userInfo.putString("deviceName", getDeviceName());
        return userInfo;
      }
    }
  }

}
