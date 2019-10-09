package com.camerasync.mediatransfer.mtp;

import android.mtp.MtpConstants;
import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import android.util.Log;
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

      scanObjectsInStorage(mtpDevice,consumer,storageId,format,mtpObjectInfo.getObjectHandle());

      // consumer.accept(mtpObjectInfo);

      // int associationType = mtpObjectInfo.getAssociationType();

      // if (associationType == MtpConstants.ASSOCIATION_TYPE_GENERIC_FOLDER) {
        // scan the children recursively
        // scanObjectsInStorage(mtpDevice, consumer, storageId, format, objectHandle);
        // continue;
      }
      // if (
      // @formatter:off
        // mtpObjectInfo.getFormat() == MtpConstants.FORMAT_EXIF_JPEG
        // && mtpObjectInfo.getProtectionStatus() != MtpConstants.PROTECTION_STATUS_NON_TRANSFERABLE_DATA
        // @formatter:on
      // ) {
    // }
  }
}
