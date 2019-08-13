package com.camerasync.usb;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

abstract class DeviceNotFound extends java.lang.Exception {

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
