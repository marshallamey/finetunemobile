import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  ScrollView, Text, Image, View,
} from 'react-native';
import {
  Card, List, ListItem, Button, Icon,
} from 'react-native-elements';
import Modal from 'react-native-modal';
import SpotifyWebApi from 'spotify-web-api-node';
import AppLink from 'react-native-app-link';
import HelpModal from '../components/HelpModal';
import ExpiredModal from '../components/ExpiredModal';
import * as actions from '../actions';


const spotifyApi = new SpotifyWebApi();

class Song extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      feature: 'none',
      songSaved: false,
      expiredAlert: false,

    };

    if (this.isTokenValid()) spotifyApi.setAccessToken(this.props.accessToken);

    this.toggleHelpModal = this.toggleHelpModal.bind(this);
    this.resetSongSaved = this.resetSongSaved.bind(this);
    this.toggleExpiredAlert = this.toggleExpiredAlert.bind(this);

  }

  static get propTypes() {
    return {
      navigation: PropTypes.any,
      accessToken: PropTypes.any,
      songs: PropTypes.any,
      addSongs: PropTypes.func,
    };
  }

  /** REACT NAVIGATION HEADER */
  static navigationOptions = {
    title: 'Song Details',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',
    headerRight: (<View></View>),
  };

  // Display the proper time for duration attribute
  static millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Display the proper note for key attribute
  static convertKey(note) {
    const pitchNotation = {
      0: 'C',
      1: 'C# / D\u266D',
      2: 'D',
      3: 'D# / E\u266D',
      4: 'E',
      5: 'F',
      6: 'F# / G\u266D',
      7: 'G',
      8: 'G# / A\u266D',
      9: 'A',
      10: 'A# / B\u266D',
      11: 'B',
    };
    return pitchNotation[note];
  }

  isTokenValid() {
    const currentTime = new Date().getTime();
    if (currentTime < this.props.expireTime) {
      console.log('FINETUNE APP:: accessToken is still valid', this.props.expireTime - currentTime);     
      return true;
    }
    // Show expiredModal
    this.toggleExpiredAlert();
    console.log('FINETUNE APP:: accessToken is expired!  Sending to auth flow', this.props.expireTime - currentTime);  
    // Close modal and go to auth flow after 2 seconds
    setTimeout(() => {
      this.toggleExpiredAlert();
      NativeModules.SpotifyAuth.clearAccessToken();
      NativeModules.SpotifyAuth.authenticateUser();    
    }, 2000);
    return false;
  }

  /* FUNCTION(): Show Modal with more information about an attribute */
  toggleHelpModal(id) {
    this.setState({ isModalVisible: !this.state.isModalVisible, feature: id });
  }

     /* FUNCTION(): Show Modal to validate genre selection */
     toggleExpiredAlert() {
      this.setState({ expiredAlert: !this.state.expiredAlert });
    }


  /** FUNCTION(): Make a Spotify API request to save array of tracks to library */
  saveTracks(songIds) {
    spotifyApi.addToMySavedTracks(songIds)
      .then(() => {
        this.setState({ songSaved: true });
      })
      .catch((err) => { console.log('Error saving track(s) to library: ', err); });
  }


  resetSongSaved() {
    this.setState({ songSaved: false });
  }


  render() {
    const styles = {
      /** VIEW CONTAINERS * */
      containerStyle: {
        backgroundColor: '#222222',
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
      /** HEADERS AND TEXT * */
      title: {
        color: '#222222',
        fontSize: 16,
      },
      header: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center',
      },
      /** BUTTONS * */
      buttonContainer: {
        marginTop: 20,
      },
      iconStyle: {
        name: 'help-outline',
        color: '#1ed760',
        size: 16,
      },
    };

    const { params } = this.props.navigation.state;
    const { song, features } = params;
    let mode = '';
    if (features.mode === 0) mode = ' Minor';
    else mode = ' Major';

    return (
      <ScrollView style={styles.containerStyle}>
        <ExpiredModal/>
        {/* SONG SAVED ALERT */}
        <View style={styles.modalContainer}>
          <Modal
            transparent={true}
            isVisible={this.state.songSaved}
            backdropColor={'#222222'}
            backdropOpacity={0.8}
            animationIn={'zoomInDown'}
            animationOut={'zoomOutUp'}
          >
            <View style={styles.modalContent2}>
              <Text style={{ fontSize: 24, textAlign: 'center' }}>Song successfully saved to your library!</Text>
              <Button
                title="Switch to Spotify"
                backgroundColor='#ff2525'
                containerViewStyle={{ margin: 20 }}
                color='#ffffff'
                fontSize={20}
                raised
                onPress={() => {
                  this.resetSongSaved();
                  AppLink.maybeOpenURL(song.uri, {
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
              title="Continue Browsing"
              backgroundColor='#ff2525'
              color='#ffffff'
              fontSize={20}
              raised
              onPress={ () => this.resetSongSaved() }
              />

            </View>
          </Modal>
        </View>

        <View style={{
          flexDirection: 'row', justifyContent: 'center', margin: 0, paddingTop: 10,
        }}>
          <Text style={{ color: '#ffffff', paddingRight: 10, margin: 0 }}>Scroll down for details</Text>
          <Icon name='angle-down' type='font-awesome' color='#ffffff'/>
        </View>

        <Card containerStyle={{ marginTop: 5, marginBottom: 25 }}>

          {/* Album Image */}
          <View style={{ height: 300 }}>
            <Image
              style={{ width: 300, height: 300 }}
              resizeMode='cover'
              source={{ uri: song.album.images[1].url }}
              />
          </View>

          {/* Save Song Button */}
          <Button
            raised
            icon={{ name: 'arrow-circle-o-down', type: 'font-awesome' }}
            backgroundColor='#ff2525'
            fontFamily='Lato'
            containerViewStyle={styles.buttonContainer}
            onPress={() => this.saveTracks([song.id]) }
            title='SAVE TO LIBRARY'
          />

          {/* List of Song Details */}
          <List>
            <ListItem
              title={ song.name }
              titleStyle={styles.title}
              subtitle='Track'
              hideChevron={true}
              onPress={() => {
                AppLink.maybeOpenURL(song.uri, {
                  appName: 'Spotify',
                  appStoreId: '324684580',
                  playStoreId: 'com.spotify.music',
                })
                  .catch((err) => {
                    console.log('FINETUNE APP:: Error opening Spotify', err);
                  });
              }}
            />
            <ListItem
              title={ song.artists[0].name }
              titleStyle={styles.title}
              subtitle='Artist'
              hideChevron={true}
              onPress={() => {
                AppLink.maybeOpenURL(song.artists[0].uri, {
                  appName: 'Spotify',
                  appStoreId: '324684580',
                  playStoreId: 'com.spotify.music',
                })
                  .catch((err) => {
                    console.log('FINETUNE APP:: Error opening Spotify', err);
                  });
              }}
            />
            <ListItem
              title={ song.album.name }
              titleStyle={styles.title}
              subtitle='Album'
              hideChevron={true}
              onPress={() => {
                AppLink.maybeOpenURL(song.album.uri, {
                  appName: 'Spotify',
                  appStoreId: '324684580',
                  playStoreId: 'com.spotify.music',
                })
                  .catch((err) => {
                    console.log('FINETUNE APP:: Error opening Spotify', err);
                  });
              }}
            />
            <ListItem
              title='Duration'
              titleStyle={styles.title}
              rightTitle={ Song.millisToMinutesAndSeconds(song.duration_ms) }
              hideChevron={true}
            />
            <ListItem
              title='Key'
              titleStyle={styles.title}
              rightTitle={ Song.convertKey(features.key) + mode}
              hideChevron={true}
            />
            <ListItem
              title='Loudness'
              titleStyle={styles.title}
              rightTitle={ `${(Math.round(features.loudness * 10) / 10).toFixed(1)} dB` }
              hideChevron={true}
            />
            <ListItem
              title='Time Signature'
              titleStyle={styles.title}
              rightTitle={ `${features.time_signature} beats/measure` }
              hideChevron={true}
            />
            <ListItem
              title='Tempo'
              titleStyle={styles.title}
              rightTitle={ `${(Math.round(features.tempo * 10) / 10).toFixed(1)} bpm` }
              hideChevron={true}
            />

            {/* Help Modal for ListItems which may need defining */}
            <HelpModal
              toggleHelpModal={ this.toggleHelpModal }
              isModalVisible={this.state.isModalVisible}
              feature={this.state.feature}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('ac') }
              title='Acousticness'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.acousticness * 100)} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('dnc') }
              title='Danceability'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.danceability * 100)} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('en') }
              title='Energy'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.energy * 100)} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('inst') }
              title='Instrumentalness'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.instrumentalness * 100)} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('live') }
              title='Liveness'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.liveness * 100)} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('pop') }
              title='Popularity'
              titleStyle={styles.title}
              rightTitle={ `${song.popularity} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('sp') }
              title='Speechiness'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.speechiness * 100)} / 100` }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal('val') }
              title='Valence'
              titleStyle={styles.title}
              rightTitle={ `${Math.floor(features.valence * 100)} / 100` }
              hideChevron={true}
            />
          </List>
        </Card>

      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.accessToken,
  expireTime: state.expireTime,
  songs: state.songs,
  addSongs: state.addSongs,
});

export default connect(mapStateToProps, actions)(Song);
