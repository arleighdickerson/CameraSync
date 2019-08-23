package com.camerasync.mediatransfer;

import android.Manifest.permission;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.os.Environment;
import com.camerasync.mediatransfer.DeviceNotFound.NoDevicesConnected;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.PermissionListener;
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
  public void hasStorage(Promise p) {
    try {
      int result = getReactApplicationContext()
        .checkSelfPermission(permission.WRITE_EXTERNAL_STORAGE);
      p.resolve(result == PackageManager.PERMISSION_GRANTED);
    } catch (Exception e) {
      p.reject(e);
    }
  }

  @ReactMethod
  public void authorizeStorage(Promise p) {
    requestStoragePermission(p);
  }


  @ReactMethod
  public void hasDevice(Promise p) {
    try {
      UsbDevice device = getConnectedDevice();
      if (device == null) {
        p.reject(new NoDevicesConnected());
      }
      p.resolve(getUsbManager().hasPermission(device));
    } catch (Exception e) {
      p.reject(e);
    }
  }

  @ReactMethod
  public void authorizeDevice(Promise p) {
    UsbDevice device = getConnectedDevice();
    if (device == null) {
      p.reject(new NoDevicesConnected());
    }
    requestUsbPermission(device, p);
  }

  private void requestStoragePermission(Promise p) {
    final int requestCode = 0;

    final PermissionListener listener = (int resultCode, String[] permissions, int[] grantResults) -> {
      if (resultCode == requestCode && permissions[0].equals(permission.WRITE_EXTERNAL_STORAGE)) {
        p.resolve(grantResults[0] == PackageManager.PERMISSION_GRANTED);
        return true;
      }
      return false;
    };

    final ReactActivity activity = (ReactActivity) getCurrentActivity();

    activity.requestPermissions(
      new String[]{permission.WRITE_EXTERNAL_STORAGE},
      requestCode,
      listener
    );
  }

  private void requestUsbPermission(UsbDevice device, Promise p) {
    final String actionName = ACTION_USB_PERMISSION;
    final ReactApplicationContext context = getReactApplicationContext();

    PendingIntent pendingIntent = PendingIntent.getBroadcast(
      context, 0, new Intent(actionName), 0
    );

    // register broadcast receiver
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

    // make request
    getUsbManager().requestPermission(device, pendingIntent);
  }

  private File getDestDir() {
    // put pictures from SLR here
    return new File(
      new File(Environment.getExternalStorageDirectory(), "DCIM"),
      "Camera"
    );
  }

  protected UsbDevice getConnectedDevice() {
    Collection<UsbDevice> devices = getUsbManager().getDeviceList().values();
    return devices.isEmpty() ? null : devices.iterator().next();
  }

  private UsbManager getUsbManager() {
    return (UsbManager)
      getReactApplicationContext()
        .getSystemService(Context.USB_SERVICE);
  }
}
