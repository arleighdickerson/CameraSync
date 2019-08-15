package com.camerasync.mediatransfer;

import android.mtp.MtpDevice;
import android.mtp.MtpEvent;
import android.os.AsyncTask;
import android.os.CancellationSignal;
import android.os.OperationCanceledException;
import android.util.Log;
import java.io.IOException;
import java.util.function.Consumer;
import lombok.Builder;
import lombok.NonNull;
import lombok.SneakyThrows;

@Builder
public class ReadMtpEvents extends AsyncTask<Void, MtpEvent, Void> {

  private final String tag = getClass().getPackage().getName();

  private final CancellationSignal signal = new CancellationSignal();

  @NonNull
  private final MtpDevice device;
  @NonNull
  private final Consumer<MtpEvent> callback;

  public void stop() {
    if (!isCancelled()) {
      signal.cancel();
    }
  }

  @Override
  @SneakyThrows
  protected Void doInBackground(Void... nada) {
    while (!isCancelled()) {
      try {
        MtpEvent event = device.readEvent(signal);
        publishProgress(event);
      } catch (OperationCanceledException e) {
        break;
      } catch (IOException e) {
        this.cancel(true);
        Log.e(tag, "Exception while attempting to read event from MtpDevice", e);

      }
    }
    return null;
  }

  @Override
  protected void onProgressUpdate(MtpEvent... values) {
    for (int i = 0; i < values.length; i += 1) {
      callback.accept(values[i]);
    }
  }
}
