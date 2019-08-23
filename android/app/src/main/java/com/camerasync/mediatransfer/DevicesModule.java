package com.camerasync.mediatransfer;

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
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Consumer;
import javax.annotation.Nonnull;

// https://www.codepool.biz/how-to-monitor-usb-events-on-android.html
public class DevicesModule extends ReactContextBaseJavaModule {

  DevicesModule(ReactApplicationContext reactContext) {
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

    return constants;
  }

  @ReactMethod
  public void fetchAll(Promise p) {
    p.resolve(ConversionUtil.asWritableMap(getUsbManager().getDeviceList()));
  }

  protected boolean doWithDevice(String deviceName, Promise p, Consumer<UsbDevice> consumer) {
    try {
      consumer.accept(getDevice(deviceName));
      return true;
    } catch (DeviceNotFound e) {
      p.reject(e.getCode(), e.getMessage(), e, e.getUserInfo());
      return false;
    }
  }

  protected UsbDevice getDevice(String key) throws DeviceNotFound {
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

  protected UsbDevice getDevice() throws DeviceNotFound {
    try {
      return getDeviceOption().get();
    } catch (NoSuchElementException e) {
      throw new DeviceNotFound.NoDevicesConnected();
    }
  }

  protected Optional<UsbDevice> getDeviceOption() {
    return getDeviceOption(null);
  }

  protected Optional<UsbDevice> getDeviceOption(String key) {
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

  protected UsbManager getUsbManager() {
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
