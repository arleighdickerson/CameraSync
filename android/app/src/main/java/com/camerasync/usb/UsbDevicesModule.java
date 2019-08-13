package com.camerasync.usb;

import static com.camerasync.usb.DeviceNotFound.DeviceNameMissing;
import static com.camerasync.usb.DeviceNotFound.NoDevicesConnected;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import javax.annotation.Nonnull;

public class UsbDevicesModule extends ReactContextBaseJavaModule {

  private static final String ACTION_USB_PERMISSION = UsbDevicesModule.class
    .getPackage()
    .getName()
    + ".ACTION_USB_PERMISSION";

  public UsbDevicesModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Nonnull
  @Override
  public String getName() {
    return "UsbDevicesModule";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    return constants;
  }

  @ReactMethod
  public void fetchDeviceList(Promise promise) {
    WritableMap map = Arguments.createMap();

    for (Entry<String, UsbDevice> entry : getUsbManager().getDeviceList().entrySet()) {
      String name = entry.getKey();
      UsbDevice device = entry.getValue();

      map.putMap(name, asWritableMap(device));

      promise.resolve(map);
    }
  }

  @ReactMethod
  public void requestPermissionsFromUser(String deviceName, Promise p) {
    try {
      UsbDevice device = findDeviceByName(deviceName);
      requestUsbPermission(device, p);
    } catch (DeviceNotFound e) {
      p.reject(e.getCode(), e.getMessage(), e, e.getUserInfo());
    }
  }

  private UsbDevice findDeviceByName(String name)
    throws NoDevicesConnected, DeviceNameMissing {
    Map<String, UsbDevice> devices = getUsbManager().getDeviceList();
    if (devices.size() == 0) {
      throw new NoDevicesConnected();
    }

    final UsbDevice device = devices.get(name);
    if (device == null) {
      throw new DeviceNameMissing() {
        @Override
        public String getDeviceName() {
          return name;
        }
      };
    }
    return device;
  }

  private void requestUsbPermission(UsbDevice device, Promise p) {
    final String actionName = ACTION_USB_PERMISSION;

    try {
      final ReactApplicationContext context = getReactApplicationContext();

      PendingIntent pendingIntent = PendingIntent.getBroadcast(
        context, 0, new Intent(actionName), 0
      );

      registerBroadcastReceiver(actionName, p);
      getUsbManager().requestPermission(device, pendingIntent);
    } catch (Exception e) {
      p.reject(e);
    }
  }

  private void registerBroadcastReceiver(String actionName, final Promise p) {
    final IntentFilter intentFilter = new IntentFilter(actionName);
    final BroadcastReceiver receiver = new BroadcastReceiver() {

      @Override
      public void onReceive(Context context, Intent intent) {

        if (actionName.equals(intent.getAction())) {
          p.resolve(
            intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)
          );
        }

        getReactApplicationContext().unregisterReceiver(this);
      }
    };
    getReactApplicationContext().registerReceiver(receiver, intentFilter);

  }

  private UsbManager getUsbManager() {
    return (UsbManager)
      getReactApplicationContext()
        .getSystemService(Context.USB_SERVICE);
  }

  private WritableMap asWritableMap(UsbDevice device) {
    WritableMap deviceParams = Arguments.createMap();

    deviceParams.putString("deviceName", device.getDeviceName());

    /*
    // requires minSdkVersion = 23
    deviceParams.putString("manufacturerName", device.getManufacturerName());
    deviceParams.putString("productName", device.getProductName());
    deviceParams.putString("version", device.getVersion());
    deviceParams.putString("serialNumber", device.getSerialNumber());
     */

    deviceParams.putInt("deviceId", device.getDeviceId());
    deviceParams.putInt("vendorId", device.getVendorId());
    deviceParams.putInt("productId", device.getProductId());
    deviceParams.putInt("deviceSubclass", device.getDeviceSubclass());
    deviceParams.putInt("deviceProtocol", device.getDeviceProtocol());

    return deviceParams;
  }
}
