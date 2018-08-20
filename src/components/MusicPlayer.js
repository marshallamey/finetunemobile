import React from 'react';
import { Image, View, Text } from 'react-native';
import { Icon } from 'react-native-elements'


const MusicPlayer = (props) => {
  
    return (
      <View>

        { props.playing ? 
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
            <View style={{marginRight: 10}}>
              <Image source={{ uri: props.albumCover}} style={styles.imageStyle} />
            </View> 
            <View>
              <Text style={styles.trackName}>{props.trackName}</Text>
              <Text style={styles.artistName}>{props.artistName}</Text>        
              <Text style={styles.albumName}>{props.albumName}</Text>
            </View>
          </View>
        : 
          <View style={{alignItems: 'center', marginBottom: 10 }}>
            <Image source={{ uri: props.albumCover}} style={styles.imageStyle} />
          </View>
        }
          
                 
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>

          <Icon 
            name='skip-previous'
            onPress={() => props.playPrevious() }
            iconStyle={{fontSize: 40, color: '#1ed760'}} />

            { props.playing ? 
              <Icon 
                name='pause'
                onPress={() => props.pauseSong() }
                iconStyle={{fontSize: 40, color: '#1ed760'}} />
            : 
              <Icon 
                name='play-arrow'
                onPress={() => props.resumeSong() }
                iconStyle={{fontSize: 40, color: '#1ed760'}} /> 
            }
          
          <Icon 
            name='skip-next'
            onPress={() => props.playNext() }
            iconStyle={{fontSize: 40, color: '#1ed760'}} />
        </View>
      </View>
    );
  }
  const styles = {
    imageStyle: {
      width: 75, 
      height: 75, 
      borderWidth: 2, 
      borderColor: '#ffffff'
    },
    trackName: {
      color: '#ffffff',
      fontSize: 16
    },
    artistName: {
      color: '#dddddd',
      fontSize: 14
    },
    albumName: {
      color: '#bbbbbb',
      fontSize: 12
    }
  }

export default MusicPlayer;