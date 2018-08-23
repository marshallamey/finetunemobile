import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, AsyncStorage, Image, NativeModules,
} from 'react-native';
import { Button } from 'react-native-elements';
import SpotifyWebApi from 'spotify-web-api-node';
import * as actions from '../actions';

const spotifyApi = new SpotifyWebApi();
let accessToken = '';
let expireTime = '';
let currentTime = '';

class HomeScreen extends Component {
  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
      user: { id: '' },
    };
  }

  componentDidMount() {
    this.initializeApp();
  }

  /*
  *  The Spotify SDK logs in the USER before the app starts
  *  Spotify provides an accessToken that is valid for one hour
  */
  initializeApp = async () => {
    console.log('FINETUNEAPP:: Starting app && authenticating USER');

    // If there is no accessToken in state
    if (!this.state.accessToken) {
      console.log('FINETUNE APP:: No access token in state. Checking Spotify SDK...');
      currentTime = new Date().getTime();
      expireTime = await AsyncStorage.getItem('expireTime');

      // Check Spotify SDK to see if previous token was saved
      accessToken = await NativeModules.SpotifyAuth.getAccessToken();

      // If no accessToken saved in Spotify SDK,
      // fetch previous accessToken from AsyncStorage
      if (!accessToken) {
        console.log('FINETUNE APP:: No access token in SDK.  Checking AsyncStorage..');
        accessToken = await AsyncStorage.getItem('accessToken');

        // If no accessToken in state, AsyncStorage, or Spotify SDK
        // OR if token from AsyncStorage is expired
        // Send USER to authentication flow
        if (!accessToken || currentTime >= parseInt(expireTime, 10)) {
          console.log('FINETUNE APP:: No access token found or expired token.  Sending USER to Spotify for authentication.');
          this.authenticateUser();
          return;
        }
        // If we get accessToken from AsyncStorage, continue
        console.log('FINETUNE APP:: Retrieved token from AsyncStorage');
      } else {
        // Else if we get accessToken from Spotify SDK, check if it is expired.
        // If so, send USER to auth flow
        console.log('FINETUNE APP:: Retrieved token from Spotify SDK');
        if (currentTime >= parseInt(expireTime, 10)) {
          console.log('FINETUNE APP:: Expired token.  Sending USER to Spotify for authentication.');
          this.authenticateUser();
          return;
        }
        // If not expired, save it to storage
        try {
          await AsyncStorage.setItem('accessToken', accessToken);
          console.log('FINETUNE APP:: Saved accessToken to Async ==> ', accessToken);
        } catch (error) {
          console.log('FINETUNE APP:: Error saving accessToken to Async');
        }
      }

      // If token found and not expired, display information
      console.log('ACCESS TOKEN FROM SDK ==> ', accessToken);
      console.log('TOKEN EXPIRES ==> ', expireTime);
      console.log('CURRENT TIME ==> ', currentTime);
      console.log('TIME LEFT ==> ', expireTime - currentTime);

      // Initialize Spotify Web API with accessToken
      spotifyApi.setAccessToken(accessToken);

      // Get available genres from Spotify
      const genres = await spotifyApi.getAvailableGenreSeeds();
      const allGenres = this.modifyGenres(genres.body.genres);
      // console.log("RETURNED GENRES: ", allGenres);

      // Get USER info from Spotify
      spotifyApi.getMe()
        .then((res) => {
          const user = res.body;
          // console.log("CURRENT USER: ", user);

          // Update state with all information
          this.props.addGenres(allGenres);
          this.setState({ accessToken, expireTime });
        });
    } else if (currentTime >= expireTime) {
      // There is already an accessToken in state
      // Check if it is expired
      // If so, send user to authentication flow
      console.log('FINETUNE APP:: Access token is expired!  Getting new token...');
      this.authenticateUser();
    }
  }


  /** FUNCTION(): Clear details and send USER to authentication flow */
  authenticateUser = async () => {
    // Set and save new expiration time for the coming token
    expireTime = new Date().getTime() + 3600000;
    try {
      await AsyncStorage.setItem('expireTime', JSON.stringify(expireTime));
      console.log('FINETUNE APP:: Saved new expireTime to Async ==> ', expireTime);
    } catch (error) {
      console.log('FINETUNE APP:: Error saving expireTime to Async');
    }
    try {
      await AsyncStorage.removeItem('accessToken');
      console.log('FINETUNE APP:: Removed accessToken from Async ==> ', accessToken);
    } catch (error) {
      console.log('FINETUNE APP:: Error removing accessToken from Async');
    }
    // Clear old token from Spotify SDK and start oAuth process
    NativeModules.SpotifyAuth.clearAccessToken();
    NativeModules.SpotifyAuth.authenticateUser();
  };


  /** FUNCTION(): Sign out user by clearing token from storage and Spotify SDK */
  signOutUser = async () => {
    await AsyncStorage.clear();
    NativeModules.SpotifyAuth.clearAccessToken();
  };

  /*
   * FUNCTION(): Change available genres from array to
   *  object format for SectionedMultiSelect
   */
  static modifyGenres(genres) {
    const genreObject = genres.map((genre, index) => ({
      name: genre.toUpperCase(),
      id: index,
    }));
    return genreObject;
  }


  /** REACT NAVIGATION HEADER */
  static navigationOptions = {
    title: 'FineTune Pro',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',

  };

  render() {
    const styles = {
      viewStyle: {
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
      },
      logo: {
        flex: 1,
        padding: 20,
      },
      btnMenu: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      containerStyle: {
        padding: 15,
        width: 250,
        marginBottom: 30,
        overflow: 'hidden',
      },
    };

    return (

      <View style={ styles.viewStyle }>

        {/* FINETUNE LOGO */}
        <View style={ styles.logo }>
          <Image
            source={require('../img/finetune-banner-logo.jpg')}
            style={{ height: '100%' }}
            resizeMode='contain' />
        </View>

        {/* MENU BUTTONS */}
        <View style={ styles.btnMenu }>

          <Button
            title='Search for Music'
            backgroundColor='#ff2525'
            color='#ffffff'
            fontSize={ 20 }
            borderRadius={ 40 }
            containerViewStyle={ styles.containerStyle }
            onPress={ () => this.props.navigation.navigate('ListSearch') }
          />

          <Button
            title='View FineTune Playlists'
            backgroundColor='#ff2525'
            color='#ffffff'
            fontSize={ 20 }
            borderRadius={ 40 }
            containerViewStyle={ styles.containerStyle }
            onPress={ this.signOutUser }
          />

          <Button
            title='Look Up Song Details'
            backgroundColor='#ff2525'
            color='#ffffff'
            fontSize={ 20 }
            borderRadius={ 40 }
            containerViewStyle={ styles.containerStyle }
            onPress={ () => NativeModules.SpotifyAuth.pause() }
          />

        </View>

      </View>
    );
  }
}


const mapStateToProps = state => ({
  songs: state.songs,
  addSongs: state.addSongs,
  allGenres: state.allGenres,
  addGenres: state.addGenres,
});

export default connect(mapStateToProps, actions)(HomeScreen);
