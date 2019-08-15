package com.camerasync;

import com.camerasync.util.PermissionResultHandler;
import com.camerasync.util.PermissionResultHandler.PermissionResultListener;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import lombok.Getter;

public class MainActivity extends ReactActivity {

  @Getter
  private final PermissionResultHandler permissionResultHandler = new PermissionResultHandler(this);

  public void requestPermissions(
    PermissionResultListener callback,
    int requestCode,
    String... permissions
  ) {
    permissionResultHandler.requestPermissions(callback, requestCode, permissions);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CameraSync";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }

  @Override
  public void onRequestPermissionsResult(
    int requestCode,
    String[] permissions,
    int[] grantResults
  ) {
    permissionResultHandler.emitResult(requestCode, permissions, grantResults);
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }
}
