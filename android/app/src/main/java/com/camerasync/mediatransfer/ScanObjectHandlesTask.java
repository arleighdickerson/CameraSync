package com.camerasync.mediatransfer;

import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.mtp.MtpConstants;
import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import android.os.AsyncTask;
import com.camerasync.mediatransfer.DeviceEvent.Type;
import com.camerasync.util.ConversionUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

@RequiredArgsConstructor
class ScanObjectHandlesTask extends AsyncTask<Integer, Void, WritableArray> {

  private final UsbDevice usbDevice;
  private final UsbManager usbManager;
  private final Promise promise;

  private UsbDeviceConnection connection;
  private MtpDevice mtpDevice;

  private String errorMessage;

  @Override
  protected void onPreExecute() {
    EventBus.getDefault().register(this);

    connection = usbManager.openDevice(usbDevice);

    if (connection == null) {
      errorMessage = "could not open usb device";
      this.cancel(true);
      return;
    }

    MtpDevice mtpDevice = new MtpDevice(usbDevice);

    if (!mtpDevice.open(connection)) {
      errorMessage = "could not open mtp device";
      this.cancel(true);
      return;
    }

    this.mtpDevice = mtpDevice;
  }

  protected List<Integer> resolveIds(Integer[] args) {
    List<Integer> ids = new ArrayList<>();

    Collections.addAll(ids, args);

    if (args.length == 0) {
      int[] allIds = mtpDevice.getStorageIds();
      if (allIds != null) {
        for (int i = 0; i < allIds.length; i += 1) {
          Collections.addAll(ids, allIds[i]);
        }
      }
    }

    return ids;
  }

  @Override
  protected WritableArray doInBackground(Integer... args) {
    WritableArray results = Arguments.createArray();

    for (int storageId : resolveIds(args)) {

      int[] objectHandles = mtpDevice.getObjectHandles(
        storageId,
        MtpConstants.FORMAT_EXIF_JPEG,
        0
      );

      if (objectHandles != null) {
        for (int objectHandle : objectHandles) {
          MtpObjectInfo info = mtpDevice.getObjectInfo(objectHandle);

          if (info.getProtectionStatus()
            != MtpConstants.PROTECTION_STATUS_NON_TRANSFERABLE_DATA) {
            WritableMap map = ConversionUtil.asWritableMap(info);

            results.pushMap(map);
          }
        }
      }
    }

    return results;
  }

  @Subscribe
  public void handleDeviceEvent(DeviceEvent event) {
    if (event.getType() == Type.DEVICE_DETACHED) {
      this.cancel(true);
    }
  }

  @Override
  protected void onPostExecute(WritableArray writableArray) {
    promise.resolve(writableArray);
    close();
  }

  @Override
  protected void onCancelled(WritableArray writableArray) {
    WritableMap map = Arguments.createMap();
    if (writableArray != null) {
      map.putArray("results", writableArray);
    }
    promise.reject(errorMessage == null ? "task was canceled" : errorMessage, map);
    close();
  }

  private void close() {
    if (mtpDevice != null) {
      mtpDevice.close();
    }

    if (connection != null) {
      connection.close();
    }

    EventBus.getDefault().unregister(this);
  }
}
