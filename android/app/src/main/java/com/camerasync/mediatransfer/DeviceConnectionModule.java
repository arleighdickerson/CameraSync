package com.camerasync.mediatransfer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.util.Log;
import com.camerasync.MainActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import java.util.Collection;
import java.util.Optional;
import javax.annotation.Nonnull;

// https://www.codepool.biz/how-to-monitor-usb-events-on-android.html
public class DeviceConnectionModule extends ReactContextBaseJavaModule {

  DeviceConnectionModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Nonnull
  @Override
  public String getName() {
    return "DeviceConnection";
  }

  protected Optional<UsbDevice> getConnectedDevice() {
    Collection<UsbDevice> devices = getUsbManager().getDeviceList().values();
    return devices.isEmpty() ? Optional.empty() : Optional.of(devices.iterator().next());
  }


  private UsbManager getUsbManager() {
    return (UsbManager)
      getReactApplicationContext()
        .getSystemService(Context.USB_SERVICE);
  }
}
