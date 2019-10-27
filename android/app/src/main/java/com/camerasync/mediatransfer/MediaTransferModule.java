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
import android.os.Environment;
import com.camerasync.ApplicationTerminatedEvent;
import com.camerasync.mediatransfer.exceptions.UsbConnectionException;
import com.camerasync.mediatransfer.exceptions.UsbDeviceException;
import com.camerasync.util.ConversionUtil;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionListener;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

public class MediaTransferModule extends ReactContextBaseJavaModule {

  private static final String ACTION_USB_PERMISSION = MediaTransferModule.class
    .getPackage()
    .getName()
    + ".ACTION_USB_PERMISSION";

  private static final int REQUEST_CODE_STORAGE_PERMISSION = 1;
  private static final int REQUEST_CODE_USB_PERMISSION = 2;

  private UsbDevice usbDevice;

  MediaTransferModule(ReactApplicationContext reactContext) {
    super(reactContext);

    if (getUsbManager().getDeviceList().size() > 0) {
      usbDevice = getUsbManager().getDeviceList().values().iterator().next();
    }
  }

  @Nonnull
  @Override
  public String getName() {
    return "MediaTransfer";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    Arrays.asList(DeviceEvent.Type.values()).forEach(symbol -> {
      constants.put(symbol.toString(), symbol.toString());
    });

    return constants;
  }

  @ReactMethod
  public void getDeviceInfo(Promise p) {
    if (usbDevice == null) {
      p.resolve(null);
    } else {
      WritableMap map = ConversionUtil.asWritableMap(usbDevice);
      p.resolve(map);
    }
  }

  @ReactMethod
  public void scanObjectHandles(Promise p) {
    authorizeDevice().whenComplete((res, e) -> {
      if (e != null) {
        p.reject(e);
        return;
      }

      if (!res) {
        String message = "Unauthorized: this action requires device permissions";
        p.reject(new UsbDeviceException(message));
        return;
      }

      new ScanObjectHandlesTask(usbDevice, getUsbManager(), p).execute();
    });
  }

  @ReactMethod
  public void requestDevicePermission(Promise p) {
    authorizeDevice().whenComplete((res, e) -> {
      if (e == null) {
        p.resolve(res);
      } else {
        p.reject(e);
      }
    });
  }

  @ReactMethod
  public void requestStoragePermission(Promise p) {
    authorizeExternalStorage().whenComplete((res, e) -> {
      if (e == null) {
        p.resolve(res);
      } else {
        p.reject(e);
      }
    });
  }

  /*

  @ReactMethod
  public void copyOne(int objectHandle, Promise p) {
    UsbDeviceConnection connection = getUsbManager().openDevice(usbDevice);

    if (connection == null) {
      p.reject("could not open usb device");
      return;
    }

    MtpDevice mtpDevice = new MtpDevice(usbDevice);

    if (!mtpDevice.open(connection)) {
      p.reject("could not open mtp device");
      return;
    }

    MtpObjectInfo info = mtpDevice.getObjectInfo(objectHandle);

    if (info == null) {
      p.reject("could not resolve mtp object info");
      return;
    }

    boolean successful = mtpDevice.importFile(
      objectHandle,
      getDestPath(info.getName())
    );

    if (successful) {
      p.resolve(info.getName());
    } else {
      p.resolve(null);
    }
  }
  */

  private CompletableFuture<UsbDeviceConnection> resolveUsbConnection() {
    final CompletableFuture<UsbDeviceConnection> completableFuture = new CompletableFuture<>();

    authorizeDevice().whenComplete((res, e) -> {
      if (e != null) {
        completableFuture.completeExceptionally(e);
        return;
      }

      if (!res) {
        String message = "Unauthorized: this action requires device permissions";
        completableFuture.completeExceptionally(new UsbDeviceException(message));
        return;
      }

      final UsbDeviceConnection connection = getUsbManager().openDevice(usbDevice);

      if (connection == null) {
        String message = "Could not open usb device";
        completableFuture.completeExceptionally(new UsbConnectionException(message));
        return;
      }

      completableFuture.complete(connection);
    });

    return completableFuture;
  }

  private CompletableFuture<Boolean> authorizeExternalStorage() {
    final int requestCode = REQUEST_CODE_STORAGE_PERMISSION;

    final CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();

    final PermissionListener listener = (int resultCode, String[] permissions, int[] grantResults) -> {
      if (resultCode != requestCode) {
        return false;
      }

      if (permissions.length != 2) {
        return false;
      }

      if (permissions[0].equals(permission.READ_EXTERNAL_STORAGE)
        && permissions[1].equals(permission.WRITE_EXTERNAL_STORAGE)) {
        completableFuture.complete(
          grantResults[0] == PackageManager.PERMISSION_GRANTED
            && grantResults[1] == PackageManager.PERMISSION_GRANTED
        );
        return true;
      }

      return false;
    };

    final ReactActivity activity = (ReactActivity) getCurrentActivity();

    activity.requestPermissions(
      new String[]{permission.READ_EXTERNAL_STORAGE, permission.WRITE_EXTERNAL_STORAGE},
      requestCode,
      listener
    );

    return completableFuture;
  }

  private CompletableFuture<Boolean> authorizeDevice() {
    final CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();

    if (usbDevice == null) {
      completableFuture.completeExceptionally(new UsbDeviceException("No USB Device is attached"));
    } else {
      final int requestCode = REQUEST_CODE_USB_PERMISSION;
      final String actionName = ACTION_USB_PERMISSION;
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
            completableFuture.complete(
              intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)
            );
          }
          getReactApplicationContext().unregisterReceiver(this);
        }
      };
      getReactApplicationContext().registerReceiver(receiver, intentFilter);

      // make the request
      getUsbManager().requestPermission(usbDevice, pendingIntent);
    }

    return completableFuture;
  }


  @Subscribe
  public void handle(DeviceEvent event) {
    switch (event.getType()) {
      case DEVICE_ATTACHED:
        usbDevice = event.getDevice();
        break;
      case DEVICE_DETACHED:
        usbDevice = null;
        break;
      default:
    }
    emitDeviceEvent(event);
  }

  @Subscribe
  public void handle(ApplicationTerminatedEvent event) {
    EventBus.getDefault().unregister(this);
  }

  private void emitDeviceEvent(DeviceEvent event) {
    String eventName = event.getType().toString();

    WritableMap params = Arguments.createMap();
    params.putString("type", event.getType().toString());
    params.putBoolean("error", false);
    params.putMap("payload", ConversionUtil.asWritableMap(event.getDevice()));

    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private String getDestPath(String destFilename) {
    return new File(getPicturesDir(), destFilename).getAbsolutePath();
  }

  private File getPicturesDir() {
    return new File(Environment.getExternalStorageDirectory(), Environment.DIRECTORY_PICTURES);
  }


  private UsbManager getUsbManager() {
    return (UsbManager)
      getReactApplicationContext()
        .getSystemService(Context.USB_SERVICE);
  }
}
