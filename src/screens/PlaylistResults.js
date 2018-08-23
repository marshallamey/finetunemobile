import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  NativeModules,
} from 'react-native';
import Modal from 'react-native-modal';
import { ListItem, Icon, Button } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import SpotifyWebApi from 'spotify-web-api-node';
import AppLink from 'react-native-app-link';
import axios from 'axios';
import SavePlaylistForm from '../components/SavePlaylistForm';
import MusicPlayer from '../components/MusicPlayer';
import * as actions from '../actions';


const spotifyApi = new SpotifyWebApi();
let accessToken = '';

class PlaylistResults extends Component {
  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
      deviceID: '',
      playlistName: '',
      positionValue: 0,

      playlistSaved: false,
      playlistURI: '',
      songDeleted: false,
      playbackError: false,
      playing: false,

      trackName: '',
      artistName: '',
      albumName: '',
      albumCover: 'http://res.cloudinary.com/skooliesocial/image/upload/v1533356615/finetune-square-border-logo_e4hwdv.jpg',
      songIndex: 0,
    };

    AsyncStorage.getItem('accessToken', (err, token) => {
      accessToken = token;
    });

    this.onNameChange = this.onNameChange.bind(this);
    this.playNext = this.playNext.bind(this);
    this.playPrevious = this.playPrevious.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  /** FUNCTION(): Change state of playlistName */
  onNameChange(name) {
    this.setState({ playlistName: name });
  }

  /** FUNCTION(): Make a Spotify API request to create a playlist with found music */
  savePlaylist(songURIs) {
    let playlistName = '';
    const date = new Date().toLocaleString();
    if (this.state.playlistName) playlistName = this.state.playlistName;
    else playlistName = `FineTune Playlist ${date}`;
    // Get USER id from Spotify
    spotifyApi.getMe()
      .then((user) => {
        // Create a Spotify playlist
        spotifyApi.createPlaylist(user.body.id, playlistName)
          .then((playlist) => {
            // Add the tracks to the playlist
            spotifyApi.addTracksToPlaylist(user.body.id, playlist.body.id, songURIs)
              .then(() => {
                this.setState({ playlistSaved: true, playlistURI: playlist.body.uri });
              })
              .catch((err) => { console.log('Error adding tracks to playlist: ', err.message); });
          })
          .catch((err) => { console.log('Error creating playlist: ', err.message); });
      })
      .catch((err) => { console.log('Error getting user details: ', err.message); });
  }

  /** *****************************************************
   *             MUSIC PLAYER FUNCTIONS                   *
   ****************************************************** */

  // _playAllSongs() {}

  /** FUNCTION(): Make a Spotify API request to play a song */
  playSong(index) {
    const song = this.props.songs[index];
    this.setState({
      playing: true,
      artistName: song.artists[0].name,
      albumName: song.album.name,
      trackName: song.name,
      albumCover: song.album.images[1].url,
      songIndex: index,
    });

    // If there isn't a saved device ID for the smartphone
    if (this.state.deviceID === '') {
      // Send a request to get the device ID of the phone
      axios({
        method: 'GET',
        url: 'https://api.spotify.com/v1/me/player/devices',
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => {
        // If there is a device that is a smart phone
        // TODO:: Smartphone may not be the first option!!
          if (res.data.devices.length) {
          // Save the device and play the song
            this.setState({ deviceID: res.data.devices[0].id });
            axios({
              method: 'PUT',
              url: 'https://api.spotify.com/v1/me/player/play',
              headers: { Authorization: `Bearer ${accessToken}` },
              params: { device_id: res.data.devices[0].id },
              data: { uris: [song.uri] },
            })
              .then(() => {
                axios({
                  method: 'GET',
                  url: 'https://api.spotify.com/v1/me/player/currently-playing',
                  headers: { Authorization: `Bearer ${accessToken}` },
                })
                  .then((playing) => { console.log('RESPONSE FROM CURRENTLY PLAYING ==> ', playing.data.is_playing); })
                  .catch((err) => { console.log('ERROR GETTING CURRENTLY PLAYING ', err); });
              })
              .catch((err) => {
                console.log('COULD NOT PLAY THE SONG!', err);
              });
          } else {
          // Else open the Spotify app on the phone and play the song
            AppLink.maybeOpenURL(song.uri, {
              appName: 'Spotify',
              appStoreId: '324684580',
              playStoreId: 'com.spotify.music',
            })
              .catch((err) => {
                console.log('FINETUNE APP:: Error opening Spotify', err);
              });
          }
        })
        .catch((err) => { console.log('ERROR RETRIEVING DEVICES: ', err); });
    } else {
      axios({
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { device_id: this.state.deviceID },
        data: { uris: [song.uri] },
      })
        .then((res) => {
          console.log('RESPONSE FROM PLAY SONG REQUEST ==> ', res.status);
          axios({
            method: 'GET',
            url: 'https://api.spotify.com/v1/me/player/currently-playing',
            headers: { Authorization: `Bearer ${accessToken}` },
          })
            .then((playing) => { console.log('RESPONSE FROM CURRENTLY PLAYING ==> ', playing.data.is_playing); })
            .catch((err) => { console.log('ERROR GETTING CURRENTLY PLAYING ', err); });
        })
        .catch((err) => { console.log('COULD NOT PLAY THE SONG!', err); });
    }
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
  playNext() {
    let index = 0;
    if (this.state.songIndex === this.props.songs.length - 1) index = 0;
    else index = this.state.songIndex + 1;
    this.playSong(index);
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
  playPrevious() {
    let index = 0;
    if (this.state.songIndex === 0) index = this.props.songs.length - 1;
    else index = this.state.songIndex - 1;
    this.playSong(index);
  }

  /** FUNCTION(): Make a Spotify API request to play a song */
  // resumeSong() { }

  /** FUNCTION(): Make a Spotify API request to pause a song */
  // pauseSong() { }

  /** FUNCTION(): Delete song from playlist */
  deleteSong(index) {
    const songs = this.props.songs;
    songs.splice(index, 1);
    this.props.addSongs(songs);
    this.setState({ songDeleted: true });
  }

  _resetSongDeleted() {
    this.setState({ songDeleted: false });
  }

  resetPlaylistSaved() {
    this.setState({ playlistSaved: false, playlistName: '' });
  }

  _resetPlaybackError() {
    this.setState({ playbackError: false });
  }

  /** REACT NAVIGATION HEADER */
  static navigationOptions = {
    title: 'Search Results',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',
    headerRight: (<View></View>),
  };

  render() {
    const styles = {
      containerStyle: {
        backgroundColor: '#000000',
      },
      playerStyle: {
        backgroundColor: '#222222',
        borderColor: '#777777',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        padding: 10,
      },
      formStyle: {
        backgroundColor: '#222222',
        borderColor: '#777777',
        borderWidth: 2,
        margin: 15,
        padding: 10,
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
    };
    /** Create a list of tracks returned from Spotify API
     * Use the song ID as the key for each new song component
     * Each track is a property of the song component */

    let tracks = '';
    let albumCover = '';


    if (this.props.songs.length) {
      tracks = this.props.songs.map((song, index) => {
        // If no album cover, use finetune logo
        if (song.album.images[1]) albumCover = song.album.images[1].url;
        else albumCover = 'http://res.cloudinary.com/skooliesocial/image/upload/v1533356615/finetune-square-border-logo_e4hwdv.jpg';

        return (
      <Swipeable
      key={ song.id }
      leftButtons={[
        <TouchableOpacity
          key={ song.id }
          style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}
          onPress={() => this.deleteSong(index)}
        >
        <View style={{ width: 65, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name='clear' color='#ffffff' />
        </View>
        </TouchableOpacity>,
      ]}
      leftButtonWidth={65}
      leftButtonContainerStyle={{ backgroundColor: '#ff2525' }} >

        <ListItem
          avatar={{ uri: albumCover }}
          title={ song.name }
          titleStyle={{ fontSize: 16, color: '#bbbbbb' }}
          subtitle={ song.artists[0].name }
          subtitleStyle={{ fontSize: 14, color: '#9e9e9e' }}
          rightTitle='Details'
          onPress={ () => this.playSong(index)}
          onPressRightIcon={ () => this.props.navigation.navigate('SongDetail', {
            song,
            features: song.audio_features,
          })}
        />

      </Swipeable>
        );
      });
    } else {
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
              <Text style={{ fontSize: 24, textAlign: 'center' }}>Playlist successfully saved to your library!</Text>
              <Button
                title="Switch to Spotify"
                backgroundColor='#ff2525'
                containerViewStyle={{ margin: 20 }}
                color='#ffffff'
                fontSize={20}
                raised
                onPress={() => {
                  this.resetPlaylistSaved();
                  AppLink.maybeOpenURL(this.state.playlistURI, {
                    appName: 'Spotify',
                    appStoreId: '324684580',
                    playStoreId: 'com.spotify.music',
                  });
                }}
              />

              <Button
              title="Continue Browsing"
              backgroundColor='#ff2525'
              color='#ffffff'
              fontSize={20}
              raised
              onPress={ () => this.resetPlaylistSaved() }
              />

            </View>
          </Modal>
        </View>

        <View style={styles.playerStyle}>
          <MusicPlayer
            pauseSong={this.pauseSong}
            playSong={this.playSong}
            resumeSong={this.resumeSong}
            playNext={this.playNext}
            playPrevious={this.playPrevious}
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
            savePlaylist={this.savePlaylist}
            onNameChange={this.onNameChange}
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

const mapStateToProps = state => ({
  songs: state.songs,
  addSongs: state.addSongs,
});
export default connect(mapStateToProps, actions)(PlaylistResults);
