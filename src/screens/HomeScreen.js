import React from 'react';
import { View, AsyncStorage } from 'react-native';
import Button from 'react-native-button';
import SpotifyWebApi from 'spotify-web-api-node';
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

  /** FUNCTION(): Get information from Spotify (access token, genres, user info) */
  _setAccessToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    console.log("this.props.nav.token: ", token);

    spotifyApi.setAccessToken(token);

    const allGenres = await spotifyApi.getAvailableGenreSeeds()
    //console.log("RETURNED GENRES: ", allGenres);

    // Get user id from Spotify
    spotifyApi.getMe()
    .then( res => {          
      const user = res;          
      this.setState({ access_token: token, user: user, loggedIn: true, allGenres: allGenres.body.genres })
    });
  }

  /** FUNCTION(): Sign out user by clearing token from storage */
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
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
          .then( onCreated => {
              console.log(onCreated);
              
              spotifyApi.getMyDevices()
              .then( res => {
                console.log("AVAILABLE DEVICES: ", res.body.devices);
                if ( res.body.devices.length === 0 ) {
                    // Open playlist on the web if no available device
                    window.open( playlist.external_urls.spotify, '_blank');
                } else {
                    // Start the playlist on the first available device
                    spotifyApi.play({ device_id: res.body.devices[0].id, context_uri: playlist.body.uri })
                    .catch( err => { console.log("Error playing playlist: ", err.message) })  
                }                          
              })
              .catch( err => { console.log("Error getting available devices: ", err.message) }) 
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
        this.trackSavedToast();   
    })
    .catch( err => { console.log("Error saving track(s) to library: ", err) }); 
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
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

  /** FUNCTION(): Reset haveResults flag */
  resetHaveResults() {
    this.setState({ haveResults: false }); 
  }

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
              allGenres: this.state.allGenres,
              onSearchFormSubmit: searchProps => this.musicSearch(searchProps), 
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