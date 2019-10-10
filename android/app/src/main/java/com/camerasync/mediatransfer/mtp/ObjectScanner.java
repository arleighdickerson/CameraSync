package com.camerasync.mediatransfer.mtp;

import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import java.util.function.Consumer;

public class ObjectScanner {

  public static void scanObjectsInStorage(
    MtpDevice mtpDevice,
    Consumer<MtpObjectInfo> consumer
  ) {

    // acquire storage IDs in the MTP device
    int[] storageIds = mtpDevice.getStorageIds();

    // scan each storage
    if (storageIds != null) {
      for (int storageId : storageIds) {
        scanObjectsInStorage(mtpDevice, consumer, storageId, 0, -1);
      }
    }
  }

  private static void scanObjectsInStorage(
    MtpDevice mtpDevice,
    Consumer<MtpObjectInfo> consumer,
    int storageId,
    int format,
    int parent
  ) {
    int[] objectHandles = mtpDevice.getObjectHandles(storageId, format, parent);
    if (objectHandles == null) {
      return;
    }

    for (int objectHandle : objectHandles) {
      /*
       *　It's an abnormal case that you can't acquire MtpObjectInfo from MTP device
       */
      MtpObjectInfo mtpObjectInfo = mtpDevice.getObjectInfo(objectHandle);

      if (mtpObjectInfo == null) {
        continue;
      }

      consumer.accept(mtpObjectInfo);

      scanObjectsInStorage(mtpDevice, consumer, storageId, format, mtpObjectInfo.getObjectHandle());
    }
  }
}
