package com.camerasync.mediatransfer;

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

    // viewManagers.add(new MediaTransferImageManager(reactContext));

    return viewManagers;
  }

  @Nonnull
  @Override
  public List<NativeModule> createNativeModules(@Nonnull ReactApplicationContext reactContext) {
    MediaTransferModule mediaTransferModule = new MediaTransferModule(reactContext);

    List<NativeModule> modules = new ArrayList<>();

    modules.add(mediaTransferModule);

    modules.forEach(m -> EventBus.getDefault().register(m));

    return modules;
  }
}
