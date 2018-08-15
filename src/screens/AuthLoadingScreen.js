import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  NativeModules
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._checkWithSpotify();
  }

  _checkWithSpotify = async () => {

    // Fetch access token from Spotify module
    let accessToken = await NativeModules.SpotifyAuth.getAccessToken();
    console.log("RETURNED ACCESS TOKEN!!!!", accessToken);

    // If we get an access token, save it to storage
    if (accessToken) {
      try {
        await AsyncStorage.setItem('accessToken', accessToken);
        console.log("SAVED TO ASYNC: ", accessToken);
      } catch (error) {
        console.log("ERROR SAVING TOKEN");   
      }
    }

    // If no token from Spotify, check storage to see if there is already one saved
    accessToken = await AsyncStorage.getItem('accessToken');

    // If no token in storage, go to auth flow, else send user to app
    if (accessToken) { this.props.navigation.navigate('App', {accessToken}); }
    else this.props.navigation.navigate('Auth');
  };


  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});