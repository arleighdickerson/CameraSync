package com.camerasync.mediatransfer.permissions;

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
import com.camerasync.mediatransfer.devices.DevicesModule;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.PermissionListener;
import java.io.File;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;

public class PermissionsModule extends ReactContextBaseJavaModule {

  private static final int REQUEST_CODE_STORAGE_PERMISSION = 1;
  private static final int REQUEST_CODE_USB_PERMISSION = 2;

  private static final String ACTION_USB_PERMISSION = PermissionsModule.class
    .getPackage()
    .getName()
    + ".ACTION_USB_PERMISSION";

  private final DevicesModule devicesModule;

  public PermissionsModule(ReactApplicationContext reactContext, DevicesModule devicesModule) {
    super(reactContext);
    this.devicesModule = devicesModule;
  }

  @Nonnull
  @Override
  public String getName() {
    return "Permissions";
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
  public void hasDevice(String deviceName, Promise p) {
    if (devicesModule.getDeviceOption(null).isPresent()) {
      // when the device is present, check permissions
      devicesModule.doWithDevice(
        deviceName,
        p,
        device -> p.resolve(devicesModule.getUsbManager().hasPermission(device))
      );
    } else {
      // when the device is absent, default to false
      p.resolve(false);
    }
  }

  @ReactMethod
  public void authorizeDevice(String deviceName, Promise p) {
    devicesModule.doWithDevice(deviceName, p, device -> requestUsbPermission(device, p));
  }

  private void requestStoragePermission(Promise p) {
    final int requestCode = REQUEST_CODE_STORAGE_PERMISSION;

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
    final int requestCode = REQUEST_CODE_USB_PERMISSION;
    final String actionName = ACTION_USB_PERMISSION;

    // @todo are these the correct flags?
    final int flags = PendingIntent.FLAG_UPDATE_CURRENT;

    PendingIntent pendingIntent = PendingIntent.getBroadcast(
      getReactApplicationContext(),
      requestCode,
      new Intent(actionName),
      flags
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

    // make the request
    devicesModule.getUsbManager().requestPermission(device, pendingIntent);
  }

  private File getDestDir() {
    // put pictures from SLR here
    return new File(
      new File(Environment.getExternalStorageDirectory(), "DCIM"),
      "Camera"
    );
  }
}
