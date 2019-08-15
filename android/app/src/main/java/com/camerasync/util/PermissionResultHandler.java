package com.camerasync.util;

import android.app.Activity;
import androidx.core.app.ActivityCompat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PermissionResultHandler {

  private final List<PermissionResultListener> listeners = new CopyOnWriteArrayList<>();

  private final Activity activity;

  public void requestPermissions(
    PermissionResultListener callback,
    int requestCode,
    String... permissions
  ) {
    listeners.add(
      new WrappedCallback(requestCode, permissions, callback)
    );
    ActivityCompat.requestPermissions(activity, permissions, requestCode);
  }

  public void emitResult(int requestCode, String[] permissions, int[] grantResults) {
    new ArrayList<>(listeners).forEach(
      l -> l.onRequestPermissionsResult(requestCode, permissions, grantResults)
    );
  }

  public interface PermissionResultListener {

    void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults);
  }

  @RequiredArgsConstructor
  class WrappedCallback implements PermissionResultListener {

    private final int requestCode;
    private final String[] permissions;
    private final PermissionResultListener callback;

    @Override
    public void onRequestPermissionsResult(
      int requestCode,
      String[] permissions,
      int[] grantResults
    ) {
      if (matches(requestCode, permissions)) {
        listeners.remove(this);
        callback.onRequestPermissionsResult(requestCode, permissions, grantResults);
      }
    }

    private boolean matches(int requestCode, String[] permissions) {
      return this.requestCode == requestCode
        && this.permissions.length == permissions.length
        && Arrays.asList(permissions).containsAll(Arrays.asList(this.permissions));
    }
  }
}
