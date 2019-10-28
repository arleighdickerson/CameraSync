package com.camerasync.util;

import android.hardware.usb.UsbDevice;
import android.mtp.MtpEvent;
import android.mtp.MtpObjectInfo;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.Map;
import java.util.Map.Entry;

public final class ConversionUtil {

  private ConversionUtil() {
  }

  public static WritableMap asWritableMap(Map<String, UsbDevice> devices) {
    WritableMap deviceMap = Arguments.createMap();
    for (Entry<String, UsbDevice> entry : devices.entrySet()) {
      deviceMap.putMap(entry.getKey(), asWritableMap(entry.getValue()));
    }
    return deviceMap;
  }

  public static WritableMap asWritableMap(UsbDevice device) {
    WritableMap deviceParams = Arguments.createMap();

    deviceParams.putString("deviceName", device.getDeviceName());

    deviceParams.putString("manufacturerName", device.getManufacturerName());
    deviceParams.putString("productName", device.getProductName());
    deviceParams.putString("version", device.getVersion());
    deviceParams.putString("serialNumber", device.getSerialNumber());

    deviceParams.putInt("deviceId", device.getDeviceId());
    deviceParams.putInt("vendorId", device.getVendorId());
    deviceParams.putInt("productId", device.getProductId());
    deviceParams.putInt("deviceSubclass", device.getDeviceSubclass());
    deviceParams.putInt("deviceProtocol", device.getDeviceProtocol());

    return deviceParams;
  }

  public static WritableMap asWritableMap(MtpEvent event) {
    WritableMap payload = Arguments.createMap();
    payload.putInt("eventCode", event.getEventCode());
    payload.putInt("param1", event.getParameter1());
    payload.putInt("param2", event.getParameter2());
    payload.putInt("param3", event.getParameter3());
    return payload;
  }

  public static WritableArray asWritableArray(Iterable<MtpObjectInfo> results) {
    WritableArray array = Arguments.createArray();
    results.forEach(result -> {
      array.pushMap(asWritableMap(result));
    });
    return array;
  }

  public static WritableMap asWritableMap(MtpObjectInfo mtpObjectInfo) {
    WritableMap payload = Arguments.createMap();

    payload.putInt("objectHandle", mtpObjectInfo.getObjectHandle());
    payload.putString("name", mtpObjectInfo.getName());

    payload.putInt("imagePixWidth", mtpObjectInfo.getImagePixWidth());
    payload.putInt("imagePixHeight", mtpObjectInfo.getImagePixHeight());

    int dateCreated = convertToUnix(mtpObjectInfo.getDateCreated());
    int dateModified = convertToUnix(mtpObjectInfo.getDateModified());

    payload.putInt("dateCreated", dateCreated);
    payload.putInt("dateModified", dateModified);

    return payload;
  }

  static Integer convertToUnix(long microtime) {
    if (microtime == 0L) {
      return 0;
    }

    String millis = Long.valueOf(microtime).toString();
    String seconds = millis.substring(0, millis.length() - 3);

    return Integer.parseInt(seconds);
  }
}
