import React from 'react';
import { Dimensions, ScrollView, Text, Image, View, TouchableHighlight } from 'react-native';
import { Card, List, ListItem, Button, Icon } from 'react-native-elements';
import  Modal from 'react-native-modal';


// Display the proper time for duration attribute
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Display the proper note for key attribute
function convertKey(note){
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
  
/* FUNCTION(): Show Modal with more information about an attribute */
function togglePopover(id) {
  var popoverState = id+"PopoverOpen";
  console.log(popoverState);
  console.log(this.state[popoverState]);     
  var newState = {}
  newState[popoverState] = !this.state[popoverState];
  console.log(newState);  
  this.setState(newState);
}

const styles = {
      
  /** VIEW CONTAINERS **/
  containerStyle: {
    backgroundColor: '#222222', 
    justifyContent: 'center',
  },
  requiredAlert: {
    backgroundColor: '#1ed760', 
    padding: 10,
    paddingBottom: 5
  },
  requiredOptions: {
    backgroundColor: '#222222', 
    paddingLeft: 20,            
    paddingRight: 20, 
    paddingBottom: 20           
  },
  inputView: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaaa',       
  },
  viewStyleLight: {  
    backgroundColor: '#333333',   
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    paddingBottom: 10
  },
  viewStyleDark: {    
    backgroundColor: '#222222', 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    paddingBottom: 10
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    flex: 1,
  },

  /** HEADERS AND TEXT **/
  title: {
    color: '#1ed760',
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  },
  header: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center'
  },
  subheader: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 10,

  },
  subheader2: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 10
  },
  subheader3: {
    color: '#1ed760',
    fontSize: 15,
    textAlign: 'center',
  },
  inputs: {
    paddingTop: 0,
    paddingBottom: 5,
    color: '#aaaaaa',
    fontSize: 16,
  },

  /** BUTTONS **/
  button: {
    color: '#ffffff',      
    fontSize: 20
  },
  buttonContainer: { 
    marginBottom: 5,
    padding: 10, 
    width: 100,
    borderRadius: 20, 
    backgroundColor: '#ff2525',
    justifyContent: 'center'
  },
  iconSize: 16
};


const helpModal = (

  <View style={styles.modalContainer}>

    <Modal
      transparent={true}
      isVisible={false}
      backdropColor={'#222222'}
      backdropOpacity={0.8}
      animationIn={'zoomInDown'}
      animationOut={'zoomOutUp'} 
    >
      <View style={styles.modalContent}>
          
          {/* Modal Header and Close Icon */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
            <Text style={{fontSize: 18}}>Duration</Text>
            <TouchableHighlight onPress={() => { this.togglePopover("close"); }} >
              <Icon 
                name='close' 
                color='#1ed760' 
                size={20} />
            </TouchableHighlight>
          </View>
          
          {/* Modal Body */}
          <View style={{padding: 20}}>
            <Text>This body area needs to be filled with information depending on the id</Text>
          </View> 

      </View>               
    </Modal>
  </View>
);



const Song = (props) => {
  const { params } = props.navigation.state;
  const song = params.song;
  const features = params.features;
  let mode;
    if (features.mode === 0 ) mode = ' Minor';
    else mode = ' Major';


   //console.log(song);
   console.log(features);

   return (
      <ScrollView>

        <Card>
          <View style={{height: 300}}>
          <Image
            style={{width: 300, height: 300}}
            resizeMode='cover'
            source={{ uri: song.album.images[1].url }}
            />
          </View>
          <Button
            icon={{name: 'code'}}
            backgroundColor='#03A9F4'
            fontFamily='Lato'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='SAVE TO LIBRARY' />
          <List>
            <ListItem
              title={ song.name }
              subtitle={ 'by ' + song.artists[0].name }
              hideChevron={true}
            />
            <ListItem
              title={ song.album.name }
              subtitle='Album'
              hideChevron={true}
            />
            <ListItem
              title='Duration'
              rightTitle={ millisToMinutesAndSeconds(song.duration_ms) }
              hideChevron={true}
            />
            <ListItem
              title='Key'
              rightTitle={ convertKey(features.key) + mode}
              hideChevron={true}
            />
            <ListItem
              title='Loudness'
              rightTitle={ (Math.round(features.loudness * 10) / 10).toFixed(1) + ' dB' }
              hideChevron={true}
            />
            <ListItem
              title='Time Signature'
              rightTitle={ features.time_signature + '/4' }
              hideChevron={true}
            />
            <ListItem
              title='Tempo'
              rightTitle={ (Math.round(features.tempo * 10) / 10).toFixed(1) + ' bpm' }
              hideChevron={true}
            />
                  
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("ac") }
              title='Acousticness'
              rightTitle={ Math.floor(features.acousticness * 100) + ' out of 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("dnc") }
              title='Danceability'
              rightTitle={ Math.floor(features.danceability * 100) + ' out of 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("en") }
              title='Energy'
              rightTitle={ Math.floor(features.energy * 100) + ' out of 100' }
              hideChevron={true}
            />           
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("inst") }
              title='Instrumentalness'
              rightTitle={ Math.floor(features.instrumentalness * 100) + ' out of 100' }
              hideChevron={true}
            />          
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("live") }
              title='Liveness'
              rightTitle={ Math.floor(features.liveness * 100) + ' out of 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("pop") }
              title='Popularity'
              rightTitle={ song.popularity + ' out of 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("sp") }
              title='Speechiness'
              rightTitle={ Math.floor(features.speechiness * 100) + ' out of 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={{
                name: 'help-outline',
                color: '#1ed760', 
                size: 16
              }}
              leftIconOnPress={ () => this.togglePopover("val") }
              title='Valence'
              rightTitle={ Math.floor(features.valence * 100) + ' out of 100' }
              hideChevron={true}
            />           
          </List>
        </Card>

        
      </ScrollView>
   );
}

export default Song;
