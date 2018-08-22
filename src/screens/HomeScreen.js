import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { View, AsyncStorage, Image, NativeModules } from 'react-native';
import { Button } from 'react-native-elements';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import AppLink from 'react-native-app-link';
import queryString from 'query-string';


const spotifyApi = new SpotifyWebApi();
let accessToken = "";
let expireTime = "";
let currentTime = "";


class HomeScreen extends Component {

  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
        user: {id: ""},   
        loggedIn: false               
    };  

    this._initializeApp();
    // this.getHashParams();
    
  }



  /* 
  *  The Spotify SDK logs in the USER before the app starts
  *  Spotify provides an accessToken that is valid for one hour 
  */
  _initializeApp = async () => {

    console.log("FINETUNEAPP:: Starting app && authenticating USER");

    
  }

  generateRandomString = function(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };


     /* FUNCTION(): Get access and refresh tokens */
     getHashParams() {    
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      e = r.exec(q)
      while (e) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
         e = r.exec(q);
      }
      console.log("(1) RECEIVED THESE HASH PARAMS ==> ", hashParams); 
      return hashParams;
   }

  /** FUNCTION(): Clear details and send USER to authentication flow */
  _authenticateUser = async () => {
    // Set and save new expiration time for the coming token
    expireTime = new Date().getTime() + 3600000;  
    try {
      await AsyncStorage.setItem('expireTime', JSON.stringify(expireTime));            
      console.log("FINETUNE APP:: Saved new expireTime to Async ==> ", expireTime);
    } catch (error) {
      console.log("FINETUNE APP:: Error saving expireTime to Async");   
    } 
    try {
      await AsyncStorage.removeItem('accessToken');            
      console.log("FINETUNE APP:: Removed accessToken from Async ==> ", accessToken);
    } catch (error) {
      console.log("FINETUNE APP:: Error removing accessToken from Async");   
    } 
    // Clear old token from Spotify SDK and start oAuth process
    NativeModules.SpotifyAuth.clearAccessToken();           
    NativeModules.SpotifyAuth.authenticateUser();
  };


  /** FUNCTION(): Sign out user by clearing token from storage and Spotify SDK */
  _signOutUser = async () => {
    await AsyncStorage.clear();
    NativeModules.SpotifyAuth.clearAccessToken();
  };

   /* 
   * FUNCTION(): Change available genres from array to 
   *  object format for SectionedMultiSelect 
   */
  _modifyGenres(genres) {
    const genreObject = genres.map((genre, index) => ({
      name: genre.toUpperCase(),
      id: index
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
  
      const scope = 'user-read-private playlist-modify-public user-library-modify user-modify-playback-state user-read-playback-state user-read-currently-playing';
const state = this.generateRandomString(16);
    this.props.navigation.navigate('https://accounts.spotify.com/authorize?' +
      queryString.stringify({
        response_type: 'code',
        client_id: 'dc0873f2467341dd9340d038f6234843',
        scope: scope,
        redirect_uri: 'https://finetune.herokuapp.com/callback',
        state: state,
        show_dialog: true
      })
    );
  

    return (
      
      <View style={ styles.viewStyle }>

        {/* FINETUNE LOGO */}
        <View style={ styles.logo }>
          <Image 
            source={require('../img/finetune-banner-logo.jpg')}
            style={{height: '100%'}} 
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
            onPress={ () => this.props.navigation.navigate('ListSearch', { 
              // allGenres: this.state.allGenres,
              // spotifyApi: spotifyApi 
            })} 
          />

          <Button
            title='View FineTune Playlists'
            backgroundColor='#ff2525'
            color='#ffffff'
            fontSize={ 20 }
            borderRadius={ 40 }
            containerViewStyle={ styles.containerStyle }
            onPress={ this._signOutUser }
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

const styles = {
  viewStyle: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1
  },
  logo: {
    flex: 1, 
    padding: 20
  },
  btnMenu: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }, 
  containerStyle: { 
    padding: 15, 
    width: 250,
    marginBottom: 30,
    overflow: 'hidden'   
  }
};

const mapStateToProps = state => {
  return { 
    songs: state.songs,
    addSongs: state.addSongs,
    allGenres: state.allGenres,
    addGenres: state.addGenres
  }
};

export default connect(mapStateToProps, actions)(HomeScreen);

