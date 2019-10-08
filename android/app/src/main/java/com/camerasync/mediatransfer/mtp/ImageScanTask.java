package com.camerasync.mediatransfer.mtp;

import android.mtp.MtpConstants;
import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import android.os.AsyncTask;
import com.camerasync.mediatransfer.mtp.ImageScanEvent.Type;
import org.greenrobot.eventbus.EventBus;

public class ImageScanTask extends AsyncTask<MtpDevice, MtpObjectInfo, Integer> {

  @Override
  protected Integer doInBackground(MtpDevice... args) {
    MtpDevice mtpDevice = args[0];
    /*
     * acquire storage IDs in the MTP device
     */
    int[] storageIds = mtpDevice.getStorageIds();

    if (storageIds == null) {
      return null;
    }

    /*
     * scan each storage
     */
    for (int storageId : storageIds) {
      scanObjectsInStorage(mtpDevice, storageId, 0, 0);
    }

    /* close MTP device */
    mtpDevice.close();

    return null;
  }

  private void scanObjectsInStorage(MtpDevice mtpDevice, int storageId, int format, int parent) {
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

      /*
       * Skip the object if parent doesn't match
       */
      int parentOfObject = mtpObjectInfo.getParent();
      if (parentOfObject != parent) {
        continue;
      }

      int associationType = mtpObjectInfo.getAssociationType();

      if (associationType == MtpConstants.ASSOCIATION_TYPE_GENERIC_FOLDER) {
        /* Scan the child folder */
        scanObjectsInStorage(mtpDevice, storageId, format, objectHandle);
        continue;
      }

      boolean isJpg = mtpObjectInfo.getFormat()
        == MtpConstants.FORMAT_EXIF_JPEG;

      boolean isTransferable = mtpObjectInfo.getProtectionStatus()
        != MtpConstants.PROTECTION_STATUS_NON_TRANSFERABLE_DATA;

      if (isJpg && isTransferable) {
        publishProgress(mtpObjectInfo);
        /*
        // get bitmap data from the object
        byte[] rawObject = mtpDevice.getObject(objectHandle, mtpObjectInfo.getCompressedSize());
        Bitmap bitmap = null;
        if (rawObject != null) {
          BitmapFactory.Options options = new BitmapFactory.Options();
          int scaleW = (mtpObjectInfo.getImagePixWidth() - 1) / MAX_IMAGE_WIDTH + 1;
          int scaleH = (mtpObjectInfo.getImagePixHeight() - 1) / MAX_IMAGE_HEIGHT + 1;
          int scale = Math.max(scaleW, scaleH);
          if (scale > 0) {
            options.inSampleSize = scale;
            bitmap = BitmapFactory.decodeByteArray(rawObject, 0, rawObject.length, options);
          }
        }
        if (bitmap != null) {
          // show the bitmap in UI thread
          publishProgress(bitmap);
        }
         */
      }
    }
  }

  @Override
  protected void onProgressUpdate(MtpObjectInfo... values) {
    sendEvent(values[0]);

    super.onProgressUpdate(values);
  }

  private void sendEvent(MtpObjectInfo info) {
    EventBus.getDefault().post(new ImageScanEvent(Type.MTP_SCAN, info));
  }
}
