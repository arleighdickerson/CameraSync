package com.camerasync.mediatransfer;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class HeadlessTaskService extends HeadlessJsTaskService {

  @Override
  protected HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
        "headless",
        Arguments.fromBundle(extras),
        0,
        true
      );
    }
    return null;
  }
}