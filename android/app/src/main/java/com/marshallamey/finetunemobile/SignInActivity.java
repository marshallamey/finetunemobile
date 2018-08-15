package com.marshallamey.finetunemobile;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.spotify.sdk.android.authentication.AuthenticationClient;
import com.spotify.sdk.android.authentication.AuthenticationRequest;
import com.spotify.sdk.android.authentication.AuthenticationResponse;
import com.spotify.sdk.android.player.Config;
import com.spotify.sdk.android.player.ConnectionStateCallback;
import com.spotify.sdk.android.player.Error;
import com.spotify.sdk.android.player.Player;
import com.spotify.sdk.android.player.PlayerEvent;
import com.spotify.sdk.android.player.Spotify;
import com.spotify.sdk.android.player.SpotifyPlayer;

public class SignInActivity
  extends Activity 
  implements SpotifyPlayer.NotificationCallback, ConnectionStateCallback
{
  private static final String CLIENT_ID = "dc0873f2467341dd9340d038f6234843";
  private static final String REDIRECT_URI = "finetunespotify://callback";
  private Player mPlayer;
  private static final int REQUEST_CODE = 7371;
  private static String access_token;
  private static String refresh_token;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    AuthenticationRequest.Builder builder = new AuthenticationRequest.Builder(CLIENT_ID, AuthenticationResponse.Type.TOKEN, REDIRECT_URI);
    builder.setScopes(new String[]
      {
        "user-read-private",
        "user-read-email",
        "playlist-modify-public",
        "user-library-modify",
        "user-modify-playback-state",
        "user-read-playback-state",
        "streaming"
      });
    builder.setShowDialog(true); 
    AuthenticationRequest request = builder.build();
    AuthenticationClient.openLoginActivity(this, REQUEST_CODE, request);
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
    super.onActivityResult(requestCode, resultCode, intent);

    if (requestCode == REQUEST_CODE) {
      AuthenticationResponse response = AuthenticationClient.getResponse(resultCode, intent);
      
      if (response.getType() == AuthenticationResponse.Type.TOKEN) {
        Config playerConfig = new Config(this, response.getAccessToken(), CLIENT_ID);

        access_token = response.getAccessToken();
        refresh_token = "NONE";

        Log.d("SignInActivity", "ACCESS TOKEN: " + access_token);
        Log.d("SignInActivity", "REFRESH TOKEN: " + refresh_token);

        SpotifyModule.setAccessToken(access_token);
//        SpotifyModule.setRefreshToken(refresh_token);

        Spotify.getPlayer(playerConfig, this, new SpotifyPlayer.InitializationObserver() {
          @Override
          public void onInitialized(SpotifyPlayer spotifyPlayer) {
            mPlayer = spotifyPlayer;
            mPlayer.addConnectionStateCallback(SignInActivity.this);
            mPlayer.addNotificationCallback(SignInActivity.this);
          }
          @Override
            public void onError(Throwable throwable) {
            Log.e("MainActivity", "Could not initialize player: " + throwable.getMessage());
          }
        });

      Intent returnIntent = new Intent(this, MainActivity.class);
      startActivity(returnIntent);

      }
    }
  }

  @Override
  protected void onDestroy() {
      Spotify.destroyPlayer(this);
      super.onDestroy();
  }

  @Override
  public void onPlaybackEvent(PlayerEvent playerEvent) {
      Log.d("MainActivity", "Playback event received: " + playerEvent.name());
      switch (playerEvent) {
          // Handle event type as necessary
          default:
              break;
      }
  }

  @Override
  public void onPlaybackError(Error error) {
      Log.d("MainActivity", "Playback error received: " + error.name());
      switch (error) {
          // Handle error type as necessary
          default:
              break;
      }
  }

  @Override
  public void onLoggedIn() {
      Log.d("MainActivity", "User logged in");

      mPlayer.playUri(null, "spotify:track:2TpxZ7JUBn3uw46aR7qd6V", 0, 0);
  }

  @Override
  public void onLoggedOut() {
      Log.d("MainActivity", "User logged out");
  }

  @Override
  public void onLoginFailed(Error var1) {
      Log.d("MainActivity", "Login failed");
  }

  @Override
  public void onTemporaryError() {
      Log.d("MainActivity", "Temporary error occurred");
  }

  @Override
  public void onConnectionMessage(String message) {
      Log.d("MainActivity", "Received connection message: " + message);
  }

}

