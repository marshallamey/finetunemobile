import React, { Component } from 'react';

import { 
  NativeModules,
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
  console.log("ALBUMCOVER:: ", props.albumCover);
  
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Image source={{ uri: props.albumCover}} style={{width: 60, height: 60}} />
          </View>
          <View>
            <Text>{props.trackName}</Text>
            <Text>{props.artistName}</Text>        
            <Text>{props.albumName}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>

          <Icon 
            name='skip-previous'
            onPress={() => props.playPrevious() }
            iconStyle={{fontSize: 40}} />

            { props.playing ? 
              <Icon 
                name='pause'
                onPress={() => props.pauseSong() }
                iconStyle={{fontSize: 40}} />
            : 
              <Icon 
                name='play-arrow'
                onPress={() => props.resumeSong() }
                iconStyle={{fontSize: 40}} /> 
            }
          
          <Icon 
            name='skip-next'
            onPress={() => props.playNext() }
            iconStyle={{fontSize: 40}} />
        </View>
      </View>
    );
  }

export default MusicPlayer;