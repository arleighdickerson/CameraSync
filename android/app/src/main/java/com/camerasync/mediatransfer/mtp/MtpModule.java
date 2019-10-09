package com.camerasync.mediatransfer.mtp;

import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.mtp.MtpConstants;
import android.mtp.MtpDevice;
import android.mtp.MtpObjectInfo;
import android.os.Environment;
import android.util.Log;
import com.camerasync.ApplicationTerminatedEvent;
import com.camerasync.mediatransfer.devices.DevicesModule;
import com.camerasync.mediatransfer.permissions.PermissionsModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.io.File;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

public class MtpModule extends ReactContextBaseJavaModule {

  private final DevicesModule devices;
  private final PermissionsModule permissions;

  public MtpModule(ReactApplicationContext reactContext, DevicesModule devices,
    PermissionsModule permissions) {
    super(reactContext);
    this.devices = devices;
    this.permissions = permissions;
  }

  @Nonnull
  @Override
  public String getName() {
    return "Mtp";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    Arrays.asList(ImageScanEvent.Type.values()).forEach(symbol -> {
      constants.put(symbol.toString(), symbol.toString());
    });

    return constants;
  }

  public void doWithMtpDevice(Promise p, Consumer<MtpDevice> consumer) {
    Optional<UsbDevice> deviceOption = devices.getDeviceOption();

    if (!deviceOption.isPresent()) {
      p.reject("no usb device connected");
      return;
    }

    UsbDevice usbDevice = deviceOption.get();

    permissions.requestStoragePermission(storageAuthorized -> {
      if (!storageAuthorized) {
        p.reject("could not get storage permission");
        return;
      }
      permissions.requestUsbPermission(usbDevice, usbAuthorized -> {
        if (!usbAuthorized) {
          p.reject("could not get permission to open usb device");
          return;
        }

        UsbDeviceConnection usbDeviceConnection = devices.getUsbManager().openDevice(usbDevice);

        if (usbDeviceConnection == null) {
          p.reject("could not open usb device");
          return;
        }

        MtpDevice mtpDevice = new MtpDevice(usbDevice);
        if (!mtpDevice.open(usbDeviceConnection)) {
          p.reject("could not open mtp device");
          return;
        }

        consumer.accept(mtpDevice);
      });
    });
  }

  @ReactMethod
  public void copyOne(Promise p) {
    doWithMtpDevice(p, mtpDevice -> {
      List<MtpObjectInfo> mtpObjectInfos = new LinkedList<>();
      ObjectScanner.scanObjectsInStorage(mtpDevice, mtpObjectInfo -> {
        if (mtpObjectInfo.getFormat() != MtpConstants.FORMAT_EXIF_JPEG
          || mtpObjectInfo.getProtectionStatus()
          == MtpConstants.PROTECTION_STATUS_NON_TRANSFERABLE_DATA) {
          return;
        }
        mtpObjectInfos.add(mtpObjectInfo);
      });

      MtpObjectInfo info = mtpObjectInfos.get(6);
      boolean successful = mtpDevice.importFile(
        info.getObjectHandle(),
        getDestPath(info.getName())
      );

      p.resolve(successful);
    });
  }

  /*
  private File getDestDir() {
    // put pictures from SLR here
    return new File(
      new File(Environment.getExternalStorageDirectory(), "DCIM"),
      "Camera"
    );
  }
   */

  private String getDestPath(String destFilename) {
    return new File(getPicturesDir(), destFilename).getAbsolutePath();
  }

  private File getPicturesDir() {
    return new File(Environment.getExternalStorageDirectory(), Environment.DIRECTORY_PICTURES);
  }

  @ReactMethod
  public void scan(Promise p) {
    doWithMtpDevice(p, mtpDevice -> {
      ObjectScanner.scanObjectsInStorage(mtpDevice, mtpObjectInfo -> {
        if (mtpObjectInfo.getFormat() != MtpConstants.FORMAT_EXIF_JPEG
          || mtpObjectInfo.getProtectionStatus()
          == MtpConstants.PROTECTION_STATUS_NON_TRANSFERABLE_DATA) {
          return;
        }
        Log.i("ObjectScanner",
          "[" + mtpObjectInfo.getStorageId() + "] " + mtpObjectInfo.getParent() + " "
            + mtpObjectInfo.getObjectHandle() + " " + mtpObjectInfo.getName());
      });
    });
  }

  @Subscribe
  public void handle(ApplicationTerminatedEvent event) {
    EventBus.getDefault().unregister(this);
  }
}
