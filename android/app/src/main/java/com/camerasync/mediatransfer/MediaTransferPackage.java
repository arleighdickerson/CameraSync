package com.camerasync.mediatransfer;

import com.camerasync.mediatransfer.devices.DevicesModule;
import com.camerasync.mediatransfer.permissions.PermissionsModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.EventBus;

public class MediaTransferPackage implements ReactPackage {

  @Nonnull
  @Override
  public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
    return Collections.emptyList();
  }

  @Nonnull
  @Override
  public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
    DevicesModule devicesModule = new DevicesModule(reactContext);
    PermissionsModule permissionsModule = new PermissionsModule(reactContext, devicesModule);

    List<NativeModule> modules = new ArrayList<>();

    modules.add(devicesModule);
    modules.add(permissionsModule);

    modules.forEach(m -> EventBus.getDefault().register(m));

    return modules;
  }
}
