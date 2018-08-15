package com.marshallamey.finetunemobile;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class SpotifyModule extends ReactContextBaseJavaModule {

  private static String access_token;
  // private static String refresh_token;

  SpotifyModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  // Return the name of this module to access methods in React Native
  @Override
  public String getName() {
    return "SpotifyAuth";
  }

  // Start SignIn Process with Spotify
  @ReactMethod
  public void authenticateUser() {
    Log.d("SpotifyModule", "Authenticating User...");

    Activity activity = getCurrentActivity();
    if (activity != null) {
      Intent intent = new Intent(activity, SignInActivity.class);
      activity.startActivity(intent);
    }
  }

  // Send ACCESS TOKEN to React Native
  @ReactMethod
  static void getAccessToken(@Nonnull Promise promise) {
    promise.resolve(access_token);
  }

  // Retrieve ACCESS TOKEN from SignInActivity
  static void setAccessToken(String token) {
    access_token = token;
  }

  // static void setRefreshToken(String token) {
  //   refresh_token = token;
  // }

}


