package com.camerasync.mediatransfer;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbManager;
import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewProps;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ImageResizeMode;
import com.facebook.react.views.image.ReactImageView;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class MediaTransferImageManager extends SimpleViewManager<ReactImageView> {

  public static final String REACT_CLASS = "MTPImageView";

  private static int MAX_IMAGE_WIDTH = 800;
  private static int MAX_IMAGE_HEIGHT = 600;

  private final ReactApplicationContext reactContext;

  MediaTransferImageManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Nonnull
  @Override
  protected ReactImageView createViewInstance(@Nonnull ThemedReactContext reactContext) {

    return new ReactImageView(
      reactContext,
      Fresco.newDraweeControllerBuilder(),
      null,
      null
    );
  }

  private MtpDevice getMtpDevice() {
    UsbManager manager = (UsbManager) reactContext
      .getApplicationContext()
      .getSystemService(Context.USB_SERVICE);

    if (manager.getDeviceList().size() == 0) {
      return null;
    }

    UsbDevice usbDevice = manager.getDeviceList().values().iterator().next();

    MtpDevice device = new MtpDevice(usbDevice);

    UsbDeviceConnection connection = manager.openDevice(usbDevice);

    if (connection == null) {
      return null;
    }

    if (!device.open(connection)) {
      return null;
    }

    return device;
  }

  @ReactProp(name = "objectHandle")
  public void setObjectHandle(ReactImageView view, int objectHandle) {
    MtpDevice mtpDevice = getMtpDevice();
    byte[] rawObject = null;
    Bitmap bitmap = null;

    MtpObjectInfo mtpObjectInfo = mtpDevice.getObjectInfo(objectHandle);

    if (mtpObjectInfo != null) {
      rawObject = mtpDevice.getObject(objectHandle, mtpObjectInfo.getCompressedSize());
    }

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
      view.setImageBitmap(bitmap);
    } else {
      WritableArray array = Arguments.createArray();
      array.pushString("https://picsum.photos/800/600");
      view.setSource(array);
    }

    mtpDevice.close();
  }

  @ReactProp(name = "src")
  public void setSrc(ReactImageView view, @Nullable ReadableArray sources) {
    view.setSource(sources);
  }

  @ReactProp(name = "borderRadius", defaultFloat = 0f)
  public void setBorderRadius(ReactImageView view, float borderRadius) {
    view.setBorderRadius(borderRadius);
  }

  @ReactProp(name = ViewProps.RESIZE_MODE)
  public void setResizeMode(ReactImageView view, @Nullable String resizeMode) {
    view.setScaleType(ImageResizeMode.toScaleType(resizeMode));
  }
}
