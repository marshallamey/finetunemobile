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
      Intent intent = new Intent(activity, MainActivity.class);
      activity.startActivity(intent);
    }
  }

   // Play Cool Blue In FineTune
  @ReactMethod
  static void playSample() {
    Log.d("SpotifyModule", "Trying to play cool blue");
    MainActivity.mPlayer.playUri(null, "spotify:track:0Lbe98RKWwBbu1sipPSa4n", 0, 0);
  }
  
  // Play a song in FineTune
  @ReactMethod
  static void playSong(String song_uri) {
    Log.d("SpotifyModule", "Playing: " + song_uri);
    MainActivity.mPlayer.playUri(null, song_uri, 0, 0);
  }

  // Pause a song in FineTune
  @ReactMethod
  static void pause(@Nonnull Promise promise) {
    Log.d("SpotifyModule", "Pausing track...");
    MainActivity.mPlayer.pause(null);
    promise.resolve((int)MainActivity.mPlayer.getPlaybackState().positionMs);
  }

  // Resume a song in FineTune
  @ReactMethod
  static void resume() {
    Log.d("SpotifyModule", "Resuming track...");
    MainActivity.mPlayer.resume(null);
  }

  // Skip to next song in FineTune
  @ReactMethod
  static void skipToNext() {
    Log.d("SpotifyModule", "Skipping to next track...");
    MainActivity.mPlayer.skipToNext(null);
  }

  // Skip to previous song in FineTune
  @ReactMethod
  static void skipToPrevious() {
    Log.d("SpotifyModule", "Skipping to previous track...");
    MainActivity.mPlayer.skipToPrevious(null);
  }

  // Get position of song in FineTune
  @ReactMethod
  static void getPosition() {
    Log.d("SpotifyModule", "Trying to pause...");
   
  }

  // Send ACCESS TOKEN to React Native
  @ReactMethod
  static void getAccessToken(@Nonnull Promise promise) {
    promise.resolve(MainActivity.accessToken);
  }

    // Send ACCESS TOKEN to React Native
  @ReactMethod
  static void getExpiresIn(@Nonnull Promise promise) {
    promise.resolve(MainActivity.expiresIn);
  }

   // Send ACCESS TOKEN to React Native
  @ReactMethod
  static void clearAccessToken() {
    MainActivity.accessToken = "";
  }


}


