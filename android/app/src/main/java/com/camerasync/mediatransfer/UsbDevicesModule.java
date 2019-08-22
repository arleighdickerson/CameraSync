package com.camerasync.mediatransfer;

import android.Manifest.permission;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.mtp.MtpDevice;
import android.mtp.MtpEvent;
import android.os.Bundle;
import android.os.Environment;
import com.camerasync.MainActivity;
import com.camerasync.mediatransfer.DeviceNotFound.NoDevicesConnected;
import com.camerasync.util.ConversionUtil;
import com.camerasync.util.PermissionResultHandler.PermissionResultListener;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.io.File;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;

public class UsbDevicesModule extends ReactContextBaseJavaModule {

  private static final String ACTION_USB_PERMISSION = UsbDevicesModule.class
    .getPackage()
    .getName()
    + ".ACTION_USB_PERMISSION";

  UsbDevicesModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Nonnull
  @Override
  public String getName() {
    return "UsbDevices";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    return constants;
  }

  @ReactMethod
  public void authorizeStorage(Promise p) {
    MainActivity activity = (MainActivity) getReactApplicationContext().getCurrentActivity();

    PermissionResultListener listener = (
      int requestCode,
      String[] permissions,
      int[] grantResults
    ) -> p.resolve(grantResults[0] == PackageManager.PERMISSION_GRANTED);

    activity.requestPermissions(listener, 0, permission.WRITE_EXTERNAL_STORAGE);
  }

  @ReactMethod
  public void authorizeDevice(Promise p) {
    UsbDevice device = getConnectedDevice();
    if (device == null) {
      p.reject(new NoDevicesConnected());
    }
    requestUsbPermission(device, p);
  }

  @ReactMethod
  public void readEvent(Promise p) {
    UsbDevice usbDevice = getConnectedDevice();
    if (usbDevice == null) {
      p.reject(new NoDevicesConnected());
    }

    MtpDevice mtpDevice = new MtpDevice(usbDevice);
    UsbDeviceConnection conn = getUsbManager().openDevice(usbDevice);
    if (conn == null) {
      p.reject("Open usbDevice failed");
    }
    if (!mtpDevice.open(conn)) {
      p.reject("Open mtpDevice failed");
    }

    try {
      MtpEvent event = mtpDevice.readEvent(null);
      p.resolve(ConversionUtil.asWritableMap(event));
    } catch (Exception e) {
      p.reject(e);
    }
  }

  @ReactMethod
  public void start(Promise p) {
    Intent service = new Intent(
      getReactApplicationContext().getApplicationContext(),
      HeadlessTaskService.class
    );
    Bundle bundle = new Bundle();
    service.putExtras(bundle);

    getReactApplicationContext().getApplicationContext().startService(service);
    HeadlessJsTaskService.acquireWakeLockNow(getReactApplicationContext().getApplicationContext());
    p.resolve(null);
  }

  protected UsbDevice getConnectedDevice() {
    Collection<UsbDevice> devices = getUsbManager().getDeviceList().values();
    return devices.isEmpty() ? null : devices.iterator().next();
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

  private File getDestDir() {
    // put pictures from SLR here
    return new File(
      new File(Environment.getExternalStorageDirectory(), "DCIM"),
      "Camera"
    );
  }

  private UsbManager getUsbManager() {
    return (UsbManager)
      getReactApplicationContext()
        .getSystemService(Context.USB_SERVICE);
  }
}
