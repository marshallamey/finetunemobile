import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { 
  ScrollView, 
  Image, 
  View, 
  TouchableOpacity, 
  Text, 
  AsyncStorage, 
  NativeModules } from 'react-native';
import  Modal from 'react-native-modal';
import { ListItem, Icon, Button } from 'react-native-elements'
import Swipeable from 'react-native-swipeable';
import MusicPlayer from '../components/MusicPlayer';
import SavePlaylistForm from '../components/SavePlaylistForm';
import SpotifyWebApi from 'spotify-web-api-node';
import AppLink from 'react-native-app-link';



const spotifyApi = new SpotifyWebApi();


class PlaylistResults extends Component {

  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
        playlistName: '', 
        positionValue: 0,

        playlistSaved: false, 
        playlistURI: '',       
        songDeleted: false,
        playbackError: false,
        playing: false,

        trackName: "",
        artistName: "",
        albumName: "",
        albumCover: "http://res.cloudinary.com/skooliesocial/image/upload/v1533356615/finetune-square-border-logo_e4hwdv.jpg",    
        songIndex: 0 
    };  

    AsyncStorage.getItem('accessToken', (err, token) => {
      if (err) console.log(err);
      else {
        console.log("GOT TOKEN ", token);
        
        spotifyApi.setAccessToken(token);
      }
    });

    this._onNameChange = this._onNameChange.bind(this);
    this._playNext = this._playNext.bind(this);
    this._playPrevious = this._playPrevious.bind(this);
    this._savePlaylist = this._savePlaylist.bind(this);
  }

  /** FUNCTION(): Change state of playlistName */
  _onNameChange(name) { 
    console.log("Playlist Name: ", name);  
    this.setState({ playlistName: name });        
 }

  /** FUNCTION(): Make a Spotify API request to create a playlist with found music */
  _savePlaylist(song_uris, name) {
    console.log('Sending uris => ', song_uris);
    console.log('Sending playlist name => ', name);
    
    let playlistName = '';
    const date = new Date().toLocaleString();
    if (this.state.playlistName) playlistName = this.state.playlistName;
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
              this.setState({ playlistSaved: true, playlistURI: playlist.body.uri })
          })
          .catch( err => { console.log("Error adding tracks to playlist: ", err.message) }) 
        })
        .catch( err => { console.log("Error creating playlist: ", err.message) }) 
    })
    .catch( err => { console.log("Error getting user details: ", err.message) })     
  }

  /********************************************************
   *             MUSIC PLAYER FUNCTIONS                   *
   *******************************************************/
  
  /** FUNCTION(): Make a Spotify API request to play a song */
  _playSong(index) {
    const song = this.props.songs[index];
    this.setState({
      playing: true,
      artistName: song.artists[0].name,
      albumName: song.album.name,
      trackName: song.name,
      albumCover: song.album.images[1].url,
      songIndex: index
    });
    NativeModules.SpotifyAuth.playSong(song.uri);
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
  _playNext() {
    let index = 0;
    if(this.state.songIndex === this.props.songs.length - 1) index = 0;
    else index = this.state.songIndex + 1;
    this._playSong(index);
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
  _playPrevious() {
    let index = 0;
    if(this.state.songIndex === 0) index = this.props.songs.length - 1
    else index = this.state.songIndex - 1;
    this._playSong(index);
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
  _resumeSong(song) {
    this.setState({ playing: true });
    NativeModules.SpotifyAuth.resume();
  }
 
  /** FUNCTION(): Make a Spotify API request to pause a song */
  _pauseSong() {
    NativeModules.SpotifyAuth.pause()
    .then(res => {
      const position = res;
      console.log("FINETUNEAPP:: Position of paused track =>", position);
      this.setState({ playing: false });    
    })
    .catch( err => {
      console.log("FINETUNEAPP:: Could not get position of paused track");     
    });
  }

  /** FUNCTION(): Delete song from playlist */
  _deleteSong(index) {
    console.log("Deleting song at index ", index);
    const songs = this.props.songs;
    songs.splice(index, 1);
    this.props.addSongs(songs);
    this.setState({ songDeleted: true });
  }

  _resetSongDeleted(){
    console.log("FINETUNEAPP:: Setting songDeleted back to false");   
    this.setState({ songDeleted: false });
  }

  _resetPlaylistSaved(){
    console.log("FINETUNEAPP:: Setting playlistSaved back to false");
    this.setState({ playlistSaved: false, playlistName: '' });
  }

  _resetPlaybackError(){
    console.log("FINETUNEAPP:: Setting playbackError back to false");
    this.setState({ playbackError: false });
  }

  /** REACT NAVIGATION HEADER */
  static navigationOptions = {
    title: 'Search Results',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',
    headerRight: (<View></View>)  
  };

  render() {

    /** Create a list of tracks returned from Spotify API
     * Use the song ID as the key for each new song component
     * Each track is a property of the song component */
     
    let tracks = '';
    let albumCover = '';
    
    
    if(this.props.songs.length) { 
      tracks = this.props.songs.map((song, index) => {
      
      //If no album cover, use finetune logo
      if (song.album.images[1]) albumCover = song.album.images[1].url; 
      else albumCover = "http://res.cloudinary.com/skooliesocial/image/upload/v1533356615/finetune-square-border-logo_e4hwdv.jpg";

      return (
      <Swipeable 
      key={ song.id }
      leftButtons={[
        <TouchableOpacity 
          style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}
          onPress={() => this._deleteSong(index)}
        > 
        <View style={{width: 65, alignItems: 'center', justifyContent: 'center'}}> 
        <Icon name='clear' color='#ffffff' />
        </View> 
        </TouchableOpacity>
       ]}
      leftButtonWidth={65}
      leftButtonContainerStyle={{backgroundColor: '#ff2525'}} >

        <ListItem   
          avatar={{ uri: albumCover }}
          title={ song.name }
          titleStyle={{fontSize: 16, color: '#bbbbbb'}}
          subtitle={ song.artists[0].name } 
          subtitleStyle={{fontSize: 14, color: '#9e9e9e'}}
          rightTitle='Details'
          onPress={ () => this._playSong(index)}
          onPressRightIcon={ () => this.props.navigation.navigate('SongDetail', {
            song: song, 
            features: song.audio_features
          })}
        />

      </Swipeable>
      );
    });
  } else {
    console.log("NO MORE SONGS");
    
    tracks = (
      <View>
        <Text>Your search returned no results. Try broadening your search criteria.</Text>
        <Button 
          title='Go Back'
          onPress={() => this.props.navigation.goBack()}
        />
      </View>
    );
  }

    return (     
      <ScrollView style={styles.containerStyle}>

        {/* PLAYLIST SAVED ALERT */}
        <View style={styles.modalContainer}>
          <Modal 
            transparent={true}
            isVisible={this.state.playlistSaved}
            backdropColor={'#222222'}
            backdropOpacity={0.8}
            animationIn={'zoomInDown'}
            animationOut={'zoomOutUp'} 
          >
            <View style={styles.modalContent2}>
              <Text style={{fontSize: 24, textAlign: 'center'}}>Playlist successfully saved to your library!</Text>
              <Button
                title="Switch to Spotify"
                backgroundColor='#ff2525'
                containerViewStyle={{margin: 20}}
                color='#ffffff'
                fontSize={20}
                raised
                onPress={() => { 
                  this._resetPlaylistSaved();
                  AppLink.maybeOpenURL(this.state.playlistURI, { 
                    appName: 'Spotify', 
                    appStoreId: '324684580', 
                    playStoreId: 'com.spotify.music' 
                  })
                  .catch((err) => {
                    console.log("FINETUNE APP:: Error opening Spotify", err);
                  });
                }}
              />

              <Button
              title="Continue Browsing"
              backgroundColor='#ff2525'
              color='#ffffff'
              fontSize={20}
              raised
              onPress={ () => this._resetPlaylistSaved() }
              />
              
            </View>
          </Modal>
        </View>

        <View style={styles.playerStyle}>
          <MusicPlayer 
            pauseSong={this._pauseSong}
            playSong={this._playSong}
            pauseSong={this._pauseSong}
            resumeSong={this._resumeSong}
            playNext={this._playNext}
            playPrevious={this._playPrevious}
            playing={this.state.playing}
            artistName={this.state.artistName}
            albumName={this.state.albumName}
            trackName={this.state.trackName}
            albumCover={this.state.albumCover}
            position={this.state.position }
          />
        </View>

        <View style={styles.formStyle}>
          <SavePlaylistForm 
            songs={this.props.songs} 
            savePlaylist={this._savePlaylist} 
            onNameChange={this._onNameChange}
            playlistName={this.state.playlistName}
          />
        </View>

        <View>
          { tracks }
          
        </View>

      </ScrollView>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: '#000000'
  },
  playerStyle: { 
    backgroundColor: '#222222',
    borderColor: '#777777',
    borderWidth: 2,
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: 15,
    padding: 10
  },
  formStyle: {
    backgroundColor: '#222222',
    borderColor: '#777777',
    borderWidth: 2,
    margin: 15,
    padding: 10,
    borderWidth: 2
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
    flex: 1,
  },
}

const mapStateToProps = state => {
  return { 
    songs: state.songs,
    addSongs: state.addSongs
  }
};
export default connect(mapStateToProps, actions)(PlaylistResults);