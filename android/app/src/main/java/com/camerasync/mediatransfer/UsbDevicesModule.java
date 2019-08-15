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
import android.os.AsyncTask;
import android.os.CancellationSignal;
import android.os.Environment;
import android.os.OperationCanceledException;
import android.util.Log;
import com.camerasync.MainActivity;
import com.camerasync.mediatransfer.DeviceNotFound.NoDevicesConnected;
import com.camerasync.util.PermissionResultHandler.PermissionResultListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.io.File;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Nonnull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;

public class UsbDevicesModule extends ReactContextBaseJavaModule {

  private static final String ACTION_USB_PERMISSION = UsbDevicesModule.class
    .getPackage()
    .getName()
    + ".ACTION_USB_PERMISSION";
  private ReadMtpEvents task;

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
  @SneakyThrows
  public void start(Promise p) {
    UsbDevice usbDevice = getConnectedDevice();
    requestUsbPermission(usbDevice, p);
    ReadEventsAsync task = new ReadEventsAsync(this);
    task.execute();
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

  @RequiredArgsConstructor
  static class ReadEventsAsync extends AsyncTask<Void, MtpEvent, Void> {

    private final CancellationSignal signal = new CancellationSignal();
    private final UsbDevicesModule module;

    private UsbDevice usbDevice;
    private UsbDeviceConnection conn;
    private MtpDevice mtpDevice;

    protected void emit(MtpEvent event) {
      WritableMap payload = Arguments.createMap();
      payload.putInt("eventCode", event.getEventCode());
      payload.putInt("param1", event.getParameter1());
      payload.putInt("param2", event.getParameter2());
      payload.putInt("param3", event.getParameter3());

      module.getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("MTP_EVENT", payload);
    }

    @Override
    protected void onPreExecute() {
      super.onPreExecute();
      usbDevice = module.getConnectedDevice();
      conn = module.getUsbManager().openDevice(usbDevice);
      mtpDevice = new MtpDevice(usbDevice);
      mtpDevice.open(conn);
    }

    public void stop() {
      if (!isCancelled()) {
        signal.cancel();
      }
    }

    @Override
    @SneakyThrows
    protected Void doInBackground(Void... nada) {
      final String tag = this.getClass().getPackage().getName();
      while (!isCancelled()) {
        try {
          MtpEvent event = mtpDevice.readEvent(signal);
          Log.d(tag, "got event");
          emit(event);
          publishProgress(event);
        } catch (OperationCanceledException e) {
          break;
        } catch (IOException e) {
          this.cancel(true);
          Log.e(tag, "Exception while attempting to read event from MtpDevice", e);
          throw e;
        }
      }
      return null;
    }

  }
}
