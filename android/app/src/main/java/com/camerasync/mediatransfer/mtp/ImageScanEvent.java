package com.camerasync.mediatransfer.mtp;


import android.mtp.MtpObjectInfo;
import lombok.Getter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class ImageScanEvent {

  public enum Type {
    MTP_SCAN;

    @Override
    public String toString() {
      return "EVENT_" + super.toString();
    }
  }

  @NonNull
  private final Type type;
  @NonNull
  private final MtpObjectInfo mtpObjectInfo;
}
