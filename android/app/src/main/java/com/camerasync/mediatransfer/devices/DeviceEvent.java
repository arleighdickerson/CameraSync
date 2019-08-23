package com.camerasync.mediatransfer.devices;


import android.hardware.usb.UsbDevice;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class DeviceEvent {

  public enum Type {
    DEVICE_ATTACHED, DEVICE_DETACHED;

    @Override
    public String toString() {
      return "EVENT_" + super.toString();
    }
  }

  @NonNull
  private final Type type;
  @NonNull
  private final UsbDevice device;
}
