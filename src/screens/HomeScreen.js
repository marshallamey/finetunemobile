import React, { Component } from 'react';
import { View, AsyncStorage, Image, NativeModules } from 'react-native';
import Button from 'react-native-button';
import SpotifyWebApi from 'spotify-web-api-node';
import seed_data from '../js/seed';
const spotifyApi = new SpotifyWebApi();
let accessToken = "";
let expiresIn = "";

export default class HomeScreen extends Component {

  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
        access_token: "",
        tokenExpires: "",
        loggedIn: false,
        user: {id: ""},
        allGenres: [],

        haveResults: false, 
        songs: [],       
        audio_features: seed_data,

        playing: false,
        trackName: "Track Name",
        artistName: "Artist Name",
        albumName: "Album Name",    
        position: 0,
        duration: 0              
    };  
    this._initializeApp();
 
    this.saveTracks = this.saveTracks.bind(this);
    this.createNewPlaylist = this.createNewPlaylist.bind(this);
  }

  _initializeApp = async () => {
    console.log("FINETUNEAPP:: Starting app && authenticating USER");
    
    /* The Spotify SDK logs in the USER before the app starts
    *  Spotify provides an accessToken that is valid for one hour 
    */

    // If there is no accessToken in state
    if (!this.state.accessToken) {
      console.log("FINETUNE APP:: No access token in state. Checking AsyncStorage...");   
      const currentTime = new Date().getTime();
      
      
      // Check AsyncStorage to see if previous token was saved
      accessToken = await AsyncStorage.getItem('accessToken');
      expiresIn = await AsyncStorage.getItem('expiresIn');

      // If no accessToken saved in AsyncStorage, 
      // fetch previous accessToken from Spotify SDK
      if(!accessToken) {
        console.log("FINETUNE APP:: No access token in phone storage.  Checking Spotify SDK...");        
        accessToken = await NativeModules.SpotifyAuth.getAccessToken();
        
        // If no accessToken in state, AsyncStorage, or Spotify SDK
        // OR if token from Spotify SDK is expired
        // Send USER to authentication flow
        if(!accessToken || currentTime >= parseInt(expiresIn)) {
          console.log("FINETUNE APP:: No access token found or expired token.  Sending USER to Spotify for authentication."); 
          this._authenticateUser(); 
          return;
        } else {
          //If we get accessToken from Spotify SDK, save it to storage
          console.log("FINETUNE APP:: Retrieved token from Spotify SDK");          
          try {
            await AsyncStorage.setItem('accessToken', accessToken);            
            console.log("FINETUNE APP:: Saved accessToken to Async ==> ", accessToken);
          } catch (error) {
            console.log("FINETUNE APP:: Error saving accessToken to Async");   
          }
        }       
      } else {
        // If we get accessToken from storage, check if it is expired
        // If so, send USER to authentication flow
        console.log("FINETUNE APP:: Retrieved token from AsyncStorage");
        if(currentTime >= parseInt(expiresIn)) {
          console.log("Expired token.  Sending USER to Spotify for authentication."); 
          this._authenticateUser(); 
          return;
        }
      }
      
      // If token found and not expired, display information
      console.log("ACCESS TOKEN FROM SDK ==> ", accessToken);
      console.log("TOKEN EXPIRES ==> ", expiresIn);
      console.log("CURRENT TIME ==> ", currentTime);
      console.log("TIME LEFT ==> ", expiresIn - currentTime);
      
      // Initialize Spotify Web API with accessToken
      spotifyApi.setAccessToken(accessToken);

      // Get available genres from Spotify
      const genres = await spotifyApi.getAvailableGenreSeeds();
      const allGenres = genres.body.genres;
      //console.log("RETURNED GENRES: ", allGenres);

      // Get USER info from Spotify
      spotifyApi.getMe()
      .then( res => {          
        const user = res.body; 
        //console.log("CURRENT USER: ", user);
          
        //Update state with all information
        this.setState({ accessToken, expiresIn, user, allGenres })
      });

    } else {
      // There is already an accessToken in state
      // Check if it is expired
      // If so, send user to authentication flow
      if ( currentTime >= expiresIn) { 
        console.log("FINETUNE APP:: Access token is expired!  Getting new token..."); 
        this._authenticateUser();
      }
    }
  };

  /** FUNCTION(): Clear details and send USER to authentication flow */
  _authenticateUser = async () => {
    // Set and save new expiration time for the coming token
    expiresIn = new Date().getTime() + 3600000;  
    try {
      await AsyncStorage.setItem('expiresIn', JSON.stringify(expiresIn));            
      console.log("FINETUNE APP:: Saved new expiresIn to Async ==> ", expiresIn);
    } catch (error) {
      console.log("FINETUNE APP:: Error saving expiresIn to Async");   
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


  /** FUNCTION(): Make a Spotify API request for music */
  musicSearch(searchProps) {
    // API request to fetch songs
    spotifyApi.getRecommendations(searchProps)
    .then( songs => {
      //console.log("(3) SONGS FROM SPOTIFY REQUEST: ", songs.body.tracks);
      
      // Get the IDs of all songs returned     
      let songIds = songs.body.tracks.map( song => { return song.id });
      //console.log("(4) IDS OF SONGS: ", songIds);

      // API request to fetch audio features for each song 
      spotifyApi.getAudioFeaturesForTracks(songIds)
      .then( res => {              
        //console.log("(5) FEATURES FROM SPOTIFY REQUEST: ", res.body.audio_features);
        
        //Update state ONCE with songs and features
        this.setState({ songs: songs.body.tracks, audio_features: res.body.audio_features, haveResults: true });      
      })
      .catch( err => { console.log("Error getting audio features: ", err) })                
    })
    .catch( err => { console.log("Error getting recommendations: ", err) });
  }

  /** FUNCTION(): Make a Spotify API request to create a playlist with found music */
  createNewPlaylist(song_uris, name) {
    console.log('Sending uris => ', song_uris);
    console.log('Sending playlist name => ', name);
    
    let playlistName = '';
    const date = new Date().toLocaleString();
    if (name) playlistName = name;
    else playlistName = "FineTune Playlist " + date;
    console.log('Sending playlist name => ', playlistName);
    // Get USER id from Spotify
    spotifyApi.getMe()
    .then( user => {
        console.log("CURRENT USER ID: ", user.body.id);        
        
        // Create a Spotify playlist
        spotifyApi.createPlaylist(user.body.id, playlistName )
        .then( playlist => {
          console.log('RETURNED PLAYLIST: ',playlist);
          
          // Add the tracks to the playlist
          spotifyApi.addTracksToPlaylist(user.body.id, playlist.body.id, song_uris)
          .then( newPlaylist => {
              console.log("PLAYLIST SAVED: ", newPlaylist); 
          })
          .catch( err => { console.log("Error adding tracks to playlist: ", err.message) }) 
        })
        .catch( err => { console.log("Error creating playlist: ", err.message) }) 
    })
    .catch( err => { console.log("Error getting user details: ", err.message) })     
  }


  /** FUNCTION(): Make a Spotify API request to save array of tracks to library */
  saveTracks(songIds) {
    spotifyApi.addToMySavedTracks(songIds)
    .then( () => {
      console.log("Track Saved", songIds);        
    })
    .catch( err => { console.log("Error saving track(s) to library: ", err) }); 
  }


  /** FUNCTION(): Make a Spotify API request to play a song */
  playSong(song) {
    NativeModules.SpotifyAuth.playSong(song.uri);
    // spotifyApi.getMyDevices()
    //     .then( res => {
    //       console.log("AVAILABLE DEVICES: ", res.body.devices);
    //       if ( res.body.devices.length === 0 ) {
    //           // Open playlist on the web if no available device
    //           Linking.openURL(song.uri+'//app');
    //           spotifyApi.play({ context_uri: song.uri })
    //           .catch( err => { console.log("Error playing song: ", err) })
             
    //       } else {
    //           // Start the playlist on the first available device
    //           spotifyApi.play({ uris: [song.uri] })
    //           .catch( err => { console.log("Error playing playlist: ", err) })  
    //       }                          
    //     })
    //     .catch( err => { console.log("Error getting available devices: ", err) }) 
  }

  /** FUNCTION(): Make a Spotify API request to pause a song */
  pauseSong(song) {
    NativeModules.SpotifyAuth.pause();
  }

  /** FUNCTION(): Reset haveResults flag */
  resetHaveResults() {
    this.setState({ haveResults: false }); 
  }

  /** Header Config */
  static navigationOptions = {
    title: 'FineTune Pro',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',
    
  };

  render() {
    console.log("RENDERING HOMESCREEN");
    console.log(this.state.haveResults);
    if (this.state.haveResults === true) {
      this.props.navigation.navigate('ListResults', {
        songs: this.state.songs,
        features: this.state.audio_features,
        createNewPlaylist: this.createNewPlaylist,
        saveTracks: this.saveTracks,
        playSong: this.playSong,
        haveResults: this.state.haveResults,
        resetHaveResults: this.resetHaveResults
      });
    }; 

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
            style={ styles.btnStyle }
            containerStyle={ styles.containerStyle }       
            onPress={ () => this.props.navigation.navigate('ListSearch',
              {
                allGenres: this.state.allGenres,
                onSearchFormSubmit: searchProps => this.musicSearch(searchProps), 
              })  }
          >
            Search for Music
          </Button>

          <Button
            style={ styles.btnStyle }
            containerStyle={ styles.containerStyle }
            onPress={ this._signOutUser }
          >
            View FineTune Playlists
          </Button>

          <Button
            style={ styles.btnStyle }
            containerStyle={ styles.containerStyle }
            onPress={ () => NativeModules.SpotifyAuth.pause() }
          >
            Look Up Song Details
          </Button>
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
  btnStyle: {
    color: '#ffffff',      
    fontSize: 20
  },
  containerStyle: { 
    padding: 15, 
    width: 250,
    marginBottom: 30,
    overflow: 'hidden', 
    borderRadius: 40, 
    backgroundColor: '#ff2525' 
  }
};
