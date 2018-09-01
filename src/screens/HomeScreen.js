import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View, Image, Text, NativeModules, AppState,
} from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import AppLink from 'react-native-app-link';
import SpotifyWebApi from 'spotify-web-api-node';
import logo from '../img/finetune-banner-logo.jpg';
import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import axios from 'axios';
import spotifyLogo from '../img/spotify-logo.png';
import * as actions from '../actions';

const tracker = new GoogleAnalyticsTracker("UA-124564441-1");


const spotifyApi = new SpotifyWebApi();
let accessToken = '';
let currentTime = '';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    tracker.trackScreenView("HomeScreen");
    this.state = {
      spotifyAlert: false,
      idSaved: false,
    };

  }

  componentDidMount() {
    this.getAccessToken();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  static get propTypes() {
    return {
      navigation: PropTypes.any,
      accessToken: PropTypes.any,
      expireTime: PropTypes.any,
      user: PropTypes.any,
      deviceID: PropTypes.any,
      allGenres: PropTypes.any,
      setGenres: PropTypes.func,
      setAccessToken: PropTypes.func,
      setUser: PropTypes.func,
      setExpireTime: PropTypes.func,
      setDeviceID: PropTypes.func,
    };
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'inactive' || nextAppState === 'background') {
      console.log('FINETUNE APP:: App is inactive or in background.');
    } else if (nextAppState === 'active') {
      console.log('FINETUNE APP:: App is active');
    }
  }

  /*  The Spotify SDK logs in the USER before the app starts
   *  Spotify provides an accessToken that is valid for one hour */
  getAccessToken() {
    console.log('FINETUNEAPP1:: Starting app && authenticating USER');

    // Get times
    currentTime = new Date().getTime();
    console.log('FINETUNEAPP2:: ExpireTime from state ', this.props.expireTime);
    if (!this.props.expireTime) this.props.expireTime = currentTime + 3600000;

    // Check Spotify SDK to see if previous token was saved
    NativeModules.SpotifyAuth.getAccessToken()
      .then((token) => {
        accessToken = token;
        console.log('FINETUNEAPP3:: AccessToken from Spotify ', accessToken);
        console.log('FINETUNEAPP3:: AccessToken from state ', this.props.accessToken);
        if (accessToken !== this.props.accessToken) this.props.setExpireTime(currentTime + 3600000);
        if (!accessToken || this.isTokenExpired()) return this.authenticateUser();

        // If token found and not expired, display information
        console.log('4ACCESS TOKEN FROM SDK ==> ', accessToken);
        console.log('4TOKEN EXPIRES ==> ', this.props.expireTime);
        console.log('4CURRENT TIME ==> ', currentTime);
        console.log('4TIME LEFT ==> ', this.props.expireTime - currentTime);
        this.props.setAccessToken(accessToken);
        this.connectToSpotify();
        return undefined;
      });
  }

  isTokenExpired() {
    if (currentTime >= this.props.expireTime) return true;
    return false;
  }

  connectToSpotify() {
    // Initialize Spotify Web API with accessToken
    spotifyApi.setAccessToken(this.props.accessToken);

    // Get available genres from Spotify
    spotifyApi.getAvailableGenreSeeds()
      .then((genres) => {
        const allGenres = HomeScreen.modifyGenres(genres.body.genres);
        // Update state with all information
        this.props.setGenres(allGenres);
      });
    this.getDeviceID();
  }

  getDeviceID() {  
    // If there isn't a saved device ID for the smartphone
    if (this.props.deviceID === '') {
      // Send a request to get the device ID of the phone
      // Send a request to get the device ID of the phone
      axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: { Authorization: `Bearer ${this.props.accessToken}` },
      })  
        .then((res) => {
          console.log(res.data.devices);
          // If there is a device that is a smartphone, save the ID
          if (res.data.devices.length) {
            res.data.devices.forEach((device) => {
              if (device.type === 'Smartphone') { this.props.setDeviceID(device.id); }
            });
          }
          console.log('NEW DEVICE ID: ', this.props.deviceID);
          
          // Check if an ID was saved, if not alert USER
          if (this.props.deviceID === '') { this.setState({ spotifyAlert: true }); }
          else this.setState({ idSaved: true });
        })
        .catch((err) => { console.log('ERROR RETRIEVING DEVICES: ', err); });
      return undefined;
    } return this.props.deviceID;
  }

  toggleSpotifyAlert() {
    this.setState({ spotifyAlert: !this.state.spotifyAlert });
  }

  toggleIdSaved() {
    this.setState({ idSaved: !this.state.idSaved });
  }


  /** FUNCTION(): Clear details and send USER to authentication flow */
  authenticateUser = async () => {
    // Clear old token from Spotify SDK and start oAuth process
    NativeModules.SpotifyAuth.clearAccessToken();
    NativeModules.SpotifyAuth.authenticateUser();
  };

  /** FUNCTION(): Sign out user by clearing token from storage and Spotify SDK */
  signOutUser = async () => {
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
      modalContent: {
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      modalContent2: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
      },
      modalContainer: {
        
      },
    };

    return (

      <View style={ styles.viewStyle }>

        {/* FINETUNE LOGO */}
        <View style={ styles.logo }>
          <Image
            source={ logo }
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
            title='View FineTune Playlist'
            backgroundColor='#ff2525'
            color='#ffffff'
            fontSize={ 20 }
            borderRadius={ 40 }
            containerViewStyle={ styles.containerStyle }
            onPress={ () => this.props.navigation.navigate('ListResults') }
          />

          <View style={{flexDirection: 'row', alignItems: 'center' }}>
            <Image source={spotifyLogo} style={{ width: 35, height: 35, marginRight: 10 }}/>
            <Text style={{ color: '#dddddd' }}>Powered by Spotify</Text>
          </View>

          {/* <Button
            title='Look Up Song Details'
            backgroundColor='#ff2525'
            color='#ffffff'
            fontSize={ 20 }
            borderRadius={ 40 }
            containerViewStyle={ styles.containerStyle }
            onPress={ () => NativeModules.SpotifyAuth.pause() }
          /> */}

          {/* OPEN SPOTIFY ALERT */}
          <View style={styles.modalContainer}>
            <Modal
              transparent={true}
              isVisible={this.state.spotifyAlert}
              backdropColor={'#222222'}
              backdropOpacity={0.8}
              animationIn={'zoomInDown'}
              animationOut={'zoomOutUp'}
            >
              <View style={styles.modalContent2}>
                <Text style={{ fontSize: 20, paddingBottom: 15 }}>
                  We need to connect to the Spotify app to make it easy for you to listen to your
                  playlists.
                </Text>
                <Text style={{ fontSize: 20, paddingBottom: 20 }}>
                  Click the top button. Then leave the music playing in the background while
                  you press the second button.
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>
                  You'll only have to do this once!
                </Text>
                <Button
                  title="Step 1: Open Spotify"
                  backgroundColor='#ff2525'
                  containerViewStyle={{ margin: 20 }}
                  color='#ffffff'
                  fontSize={18}
                  raised
                  onPress={() => {
                    AppLink.maybeOpenURL('spotify://track/4keoy2fqgwGnbWlm3ZVZFa', {
                      appName: 'Spotify',
                      appStoreId: '324684580',
                      playStoreId: 'com.spotify.music',
                    })
                      .catch((err) => {
                        console.log('FINETUNE APP:: Error opening Spotify', err);
                      });
                  }}
                />

                <Button
                title="Step 2: Connect with FineTune"
                backgroundColor='#ff2525'
                color='#ffffff'
                fontSize={16}
                raised
                onPress={ () => {
                  this.toggleSpotifyAlert();
                  this.getDeviceID();
                }}
                />

              </View>
            </Modal>
          </View>

          {/* ID SAVED ALERT */}
          <View style={styles.modalContainer}>
            <Modal
              transparent={true}
              isVisible={this.state.idSaved}
              backdropColor={'#222222'}
              backdropOpacity={0.8}
              animationIn={'zoomInDown'}
              animationOut={'zoomOutUp'}
            >
              <View style={styles.modalContent2}>
                <Text style={{ fontSize: 24, textAlign: 'center', paddingBottom: 20 }}>
                  You're all set!!  Happy searching!
                </Text>

                <Button
                title="Continue"
                backgroundColor='#ff2525'
                color='#ffffff'
                fontSize={20}
                raised
                onPress={ () => {
                  this.toggleIdSaved();
                }}
                />

              </View>
            </Modal>
          </View>
        </View>

      </View>
    );
  }
}


const mapStateToProps = state => ({
  accessToken: state.accessToken,
  expireTime: state.expireTime,
  user: state.user,
  allGenres: state.allGenres,
  setGenres: state.setGenres,
  setAccessToken: state.setAccessToken,
  setUser: state.setUser,
  setExpireTime: state.setExpireTime,
  deviceID: state.deviceID,
  setDeviceID: state.setDeviceID,
});

export default connect(mapStateToProps, actions)(HomeScreen);
