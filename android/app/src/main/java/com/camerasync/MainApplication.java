package com.camerasync;

import android.app.Application;
import com.camerasync.mediatransfer.MediaTransferPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.List;
import org.greenrobot.eventbus.EventBus;

public class MainApplication extends Application implements ReactApplication {

  static {
    EventBus.builder()
      .strictMethodVerification(true)
      .throwSubscriberException(true)
      .installDefaultEventBus();
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      packages.add(new MediaTransferPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public void onTerminate() {
    // post terminate event, all subscribers handle by unregistering
    EventBus.getDefault().post(new ApplicationTerminatedEvent());
    super.onTerminate();
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
