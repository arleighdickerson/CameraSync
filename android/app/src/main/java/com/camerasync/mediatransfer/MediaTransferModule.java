package com.camerasync.mediatransfer;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import android.os.Environment;
import com.camerasync.ApplicationTerminatedEvent;
import com.camerasync.util.ConversionUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

public class MediaTransferModule extends ReactContextBaseJavaModule {

  private static final String ACTION_USB_PERMISSION = MediaTransferModule.class
    .getPackage()
    .getName()
    + ".ACTION_USB_PERMISSION";

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
      map.putBoolean("hasPermission", getUsbManager().hasPermission(usbDevice));
      p.resolve(map);
    }
  }

  // @todo send a reason for promise rejection
  @ReactMethod
  public void requestDevicePermission(Promise p) {
    if (usbDevice == null) {
      p.reject("no devices connected");
    } else {
      authorizeDevice(p::resolve);
    }
  }

  @ReactMethod
  public void scanObjectHandles(Promise p) {
    new ScanObjectHandlesTask(usbDevice, getUsbManager(), p).execute();
  }

  private void authorizeDevice(Consumer<Boolean> consumer) {
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
          // reason: permission denied
          consumer.accept(
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

  /*
  private CompletableFuture<Boolean> permissionFuture() {
    final CompletableFuture<Boolean> completableFuture = new CompletableFuture<>();
    AsyncTask.execute(() -> authorizeDevice(completableFuture::complete));
    return completableFuture;
  }
  */

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
