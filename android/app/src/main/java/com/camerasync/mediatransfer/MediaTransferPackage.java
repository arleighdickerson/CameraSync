package com.camerasync.mediatransfer;

import com.camerasync.mediatransfer.devices.DevicesModule;
import com.camerasync.mediatransfer.mtp.MtpModule;
import com.camerasync.mediatransfer.permissions.PermissionsModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Nonnull;
import org.greenrobot.eventbus.EventBus;

public class MediaTransferPackage implements ReactPackage {

  @Nonnull
  @Override
  public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
    List<ViewManager> viewManagers = new ArrayList<>();

    viewManagers.add(new MediaTransferImageManager(reactContext));

    return viewManagers;
  }

  @Nonnull
  @Override
  public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
    DevicesModule devicesModule = new DevicesModule(reactContext);
    PermissionsModule permissionsModule = new PermissionsModule(reactContext, devicesModule);
    MtpModule mtpModule = new MtpModule(reactContext, devicesModule, permissionsModule);

    List<NativeModule> modules = new ArrayList<>();

    modules.add(devicesModule);
    modules.add(permissionsModule);
    modules.add(mtpModule);

    modules.forEach(m -> EventBus.getDefault().register(m));

    return modules;
  }
}
