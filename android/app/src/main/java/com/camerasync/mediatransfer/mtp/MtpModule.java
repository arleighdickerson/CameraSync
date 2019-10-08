package com.camerasync.mediatransfer.mtp;

import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.mtp.MtpDevice;
import com.camerasync.ApplicationTerminatedEvent;
import com.camerasync.mediatransfer.devices.DevicesModule;
import com.camerasync.util.ConversionUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

public class MtpModule extends ReactContextBaseJavaModule {

  private final DevicesModule devices;

  public MtpModule(ReactApplicationContext reactContext, DevicesModule devices) {
    super(reactContext);
    this.devices = devices;
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
  public void sync(Promise p) {
    Optional<UsbDevice> deviceOption = devices.getDeviceOption();

    if (!deviceOption.isPresent()) {
      p.reject("no usb device connected");
      return;
    }
    UsbDevice usbDevice = deviceOption.get();

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
      new ImageScanTask().execute(mtpDevice);
      p.resolve(true);
    } catch (Throwable t) {
      p.reject(t);
    }
  }

  @Subscribe
  public void handleImageScanEvent(ImageScanEvent event) {
    String eventName = event.getType().toString();

    WritableMap params = Arguments.createMap();
    params.putString("type", event.getType().toString());
    params.putBoolean("error", false);
    params.putMap("payload", ConversionUtil.asWritableMap(event.getMtpObjectInfo()));

    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  @Subscribe
  public void handle(ApplicationTerminatedEvent event) {
    EventBus.getDefault().unregister(this);
  }
}
