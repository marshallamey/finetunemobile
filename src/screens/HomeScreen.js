import React from 'react';
import { View, AsyncStorage } from 'react-native';
import Button from 'react-native-button';
import SpotifyWebApi from 'spotify-web-api-js';
import seed_data from '../js/seed';
const spotifyApi = new SpotifyWebApi();

class HomeScreen extends React.Component {

  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
        access_token: "",
        refresh_token: "",
        loggedIn: false,
        user: {id: ""}, 
        songs: [],
        allGenres: [],
        audio_features: seed_data,
        haveResults: false          
    };  

    this._setAccessToken();
      
    this.saveTracks = this.saveTracks.bind(this);
    this.createNewPlaylist = this.createNewPlaylist.bind(this);
  }

  _setAccessToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log("this.props.nav.token: ", token);

    spotifyApi.setAccessToken(token);

    const allGenres = await spotifyApi.getAvailableGenreSeeds()
    console.log("RETURNED GENRES: ", allGenres);

    // Get user id from Spotify
    spotifyApi.getMe()
    .then( res => {          
      const user = res;          
      this.setState({ access_token: token, user: user, loggedIn: true, allGenres: allGenres })
    });
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  /* FUNCTION(): Make a Spotify API request for music */
  musicSearch(searchProps) {
    // API request to fetch songs
    spotifyApi.getRecommendations(searchProps)
    .then( songs => {
      console.log("(3) SONGS FROM SPOTIFY REQUEST: ", songs.tracks);
      
      // Get the IDs of all songs returned     
      let songIds = songs.tracks.map( song => { return song.id });
      console.log("(4) IDS OF SONGS: ", songIds);

      // API request to fetch audio features for each song 
      spotifyApi.getAudioFeaturesForTracks(songIds)
      .then( res => {              
        console.log("(5) FEATURES FROM SPOTIFY REQUEST: ", res.audio_features);
        
        //Update state ONCE with songs and features
        this.setState({ songs: songs.tracks, audio_features: res.audio_features, haveResults: true });      
      })
      .catch( err => { console.log("Error getting audio features: ", err) })                
    })
    .catch( err => { console.log("Error getting recommendations: ", err) });
  }

  /* FUNCTION(): Make a Spotify API request to create a playlist with found music */
  createNewPlaylist(song_uris) {
    const date = new Date().toLocaleString();
    // Get USER id from Spotify
    spotifyApi.getMe()
    .then( user => {
        console.log("CURRENT USER ID: ", user.id);        
        
        // Create a Spotify playlist
        spotifyApi.createPlaylist(user.id, { name: "FineTune Playlist " + date })
        .then( playlist => {

          // Add the tracks to the playlist
          spotifyApi.addTracksToPlaylist(user.id, playlist.id, song_uris)
          .then( onCreated => {
              console.log(onCreated);
              
              spotifyApi.getMyDevices()
              .then( res => {
                console.log("AVAILABLE DEVICES: ", res.devices);
                this.listCreatedToast();
                if ( res.devices.length === 0 ) {
                    // Open playlist on the web if no available device
                    window.open( playlist.external_urls.spotify, '_blank');
                } else {
                    // Start the playlist on the first available device
                    spotifyApi.play({ device_id: res.devices[0].id, context_uri: playlist.uri })
                    .catch( err => { console.log("Error playing playlist: ", err) })  
                }                          
              })
              .catch( err => { console.log("Error getting available devices: ", err) }) 
          })
          .catch( err => { console.log("Error adding tracks to playlist: ", err) }) 
        })
        .catch( err => { console.log("Error creating playlist: ", err) }) 
    })
    .catch( err => { console.log("Error getting user details: ", err) })     
  }

  /* FUNCTION(): Make a Spotify API request to save array of tracks to library */
  saveTracks(songIds) {
    spotifyApi.addToMySavedTracks(songIds)
    .then( () => {
        this.trackSavedToast();   
    })
    .catch( err => { console.log("Error saving track(s) to library: ", err) }); 
  }

  playSong(song) {
    spotifyApi.getMyDevices()
        .then( res => {
          console.log("AVAILABLE DEVICES: ", res.devices);
          if ( res.devices.length === 0 ) {
              // Open playlist on the web if no available device
              window.open( song.external_urls.spotify, '_blank');
          } else {
              // Start the playlist on the first available device
              spotifyApi.play({ device_id: res.devices[0].id, context_uri: song.uri })
              .catch( err => { console.log("Error playing playlist: ", err) })  
          }                          
        })
        .catch( err => { console.log("Error getting available devices: ", err) }) 
  }

  /* FUNCTION(): Make a Spotify API request to save array of tracks to library */
  resetHaveResults() {
    this.setState({ haveResults: false }); 
  }

  render() {

    const styles = {
      viewStyle: {
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1
      },
      btnStyle: {
        color: '#ffffff',      
        fontSize: 20
      },
      containerStyle: { 
        padding: 10, 
        marginBottom: 20,
        height: 45, 
        overflow: 'hidden', 
        borderRadius: 4, 
        backgroundColor: '#333333' 
      }
    };

    return (

      <View style={ styles.viewStyle }>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }       
          onPress={ () => this.props.navigation.navigate('ListSearch',
            {
              loggedIn: this.state.loggedIn,
              onSearchFormSubmit: searchProps => this.musicSearch(searchProps), 
              haveResults: this.state.haveResults,
              resetHaveResults: () => this.resetHaveResults(),
              route_token: this.state.route_token
            })  }
        >
          Search for Music
        </Button>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }
          onPress={ () => this.props.navigation.navigate('SongSearch') }
        >
          Get Song Details
        </Button>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }
          onPress={ () => this.props.navigation.navigate('Playlists') }
        >
          See Playlists
        </Button>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }
          onPress={ this._signOutAsync }
        >
          Sign Out
        </Button>

      </View>

    );
  }
}

export default HomeScreen;