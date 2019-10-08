package com.camerasync.mediatransfer.mtp;

import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import android.util.Log;
import java.util.LinkedList;
import java.util.List;

public class ObjectScanner {

  public static List<MtpObjectInfo> scanObjectsInStorage(MtpDevice mtpDevice) {
    List<MtpObjectInfo> results = new LinkedList<>();

    // acquire storage IDs in the MTP device
    int[] storageIds = mtpDevice.getStorageIds();

    // scan each storage
    if (storageIds != null) {
      for (int storageId : storageIds) {
        scanObjectsInStorage(mtpDevice, results, storageId, 0, 0);
      }
    }

    return results;
  }

  private static void scanObjectsInStorage(
    MtpDevice mtpDevice,
    List<MtpObjectInfo> results,
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

      Log.i("ObjectScanner", mtpObjectInfo.getName());
    }
  }
}
