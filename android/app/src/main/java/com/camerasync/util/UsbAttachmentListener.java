package com.camerasync.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import lombok.Builder;
import lombok.NonNull;

@Builder
public class UsbAttachmentListener {

  private final String tag = getClass().getPackage().getName();

  @Builder.Default
  private final Listener onAttach = nullListener;
  @Builder.Default
  private final Listener onDetach = nullListener;

  @FunctionalInterface
  public interface Listener {

    void onDeviceChange(UsbDevice device, Context context, Intent intent);
  }

  public void register(Context context) {
    context.registerReceiver(receiver, new IntentFilter(UsbManager.ACTION_USB_DEVICE_ATTACHED));
    context.registerReceiver(receiver, new IntentFilter(UsbManager.ACTION_USB_DEVICE_DETACHED));
  }

  public void unregister(Context context) {
    context.unregisterReceiver(receiver);
  }


  private final BroadcastReceiver receiver = new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
      @NonNull final UsbDevice device = intent.getParcelableExtra(UsbManager.EXTRA_DEVICE);

      switch (intent.getAction()) {
        case UsbManager.ACTION_USB_DEVICE_ATTACHED:
          onAttach.onDeviceChange(device, context, intent);
          break;
        case UsbManager.ACTION_USB_DEVICE_DETACHED:
          onDetach.onDeviceChange(device, context, intent);
          break;
        default:
      }
    }
  };

  private static final Listener nullListener = (
    UsbDevice device,
    Context context,
    Intent intent
  ) -> {
  };
}
