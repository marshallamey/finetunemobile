import React from 'react';
import {
  View,
  StyleSheet,
  Image, 
  NativeModules
} from 'react-native';
import { Button } from 'react-native-elements';

export default class SignInScreen extends React.Component {


  render() {
    return (
      <View style={styles.container}>

        <Button 
          icon={{name: 'spotify', type: 'font-awesome', color: '#1ed760', size: 25}}
          title="Login with Spotify" 
          color="#1ed760"
          buttonStyle={{ 
            backgroundColor: 'transparent',
            borderRadius: 50,
            borderWidth: 1,
            borderColor: '#ffffff',
            width: 250
          }}
          fontSize={22}
          onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await NativeModules.SpotifyAuth.authenticateUser();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222222'
  },
});