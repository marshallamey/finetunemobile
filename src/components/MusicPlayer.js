import React, { Component } from 'react';

import { 
  ScrollView, 
  Slider, 
  Image, 
  View, 
  Text, 
  TextInput,
  TouchableHighlight,
TouchableOpacity } from 'react-native';
import { CheckBox, Icon, Button } from 'react-native-elements'

const MusicPlayer = (props) => {

    return (
      <View>
        <Text>Artist: {props.song.artists[0].name}</Text>
        <Text>Track: {props.song.name}</Text>
        <Text>Album: {props.song.album.name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>

          <Icon 
            name='skip-previous'
            onPress={() => NativeModules.SpotifyAuth.playPrevious() }
            iconStyle={{fontSize: 40}} />

            { props.playing ? 
              <Icon 
                name='pause'
                onPress={() => NativeModules.SpotifyAuth.pause() }
                iconStyle={{fontSize: 40}} />
            : 
              <Icon 
                name='play-arrow'
                onPress={() => NativeModules.SpotifyAuth.playSong(song.uri) }
                iconStyle={{fontSize: 40}} /> 
            }
          
          <Icon 
            name='skip-next'
            onPress={() => NativeModules.SpotifyAuth.playNext() }
            iconStyle={{fontSize: 40}} />
        </View>
      </View>
    );
  }

export default MusicPlayer;