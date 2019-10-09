package com.camerasync.mediatransfer.mtp;

import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.mtp.MtpConstants;
import android.mtp.MtpDevice;
import android.util.Log;
import com.camerasync.ApplicationTerminatedEvent;
import com.camerasync.mediatransfer.devices.DevicesModule;
import com.camerasync.mediatransfer.permissions.PermissionsModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
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

  @ReactMethod
  public void scan(Promise p) {
    Optional<UsbDevice> deviceOption = devices.getDeviceOption();

    if (!deviceOption.isPresent()) {
      p.reject("no usb device connected");
      return;
    }

    UsbDevice usbDevice = deviceOption.get();

    permissions.requestUsbPermission(usbDevice, success -> {
      if (!success) {
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

      try {
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

        p.resolve(true);
      } catch (Exception e) {
        p.reject(e);
      } finally {
        mtpDevice.close();
      }
    });
  }

  @Subscribe
  public void handle(ApplicationTerminatedEvent event) {
    EventBus.getDefault().unregister(this);
  }
}
