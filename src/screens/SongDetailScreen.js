import React, { Component } from 'react';
import { Dimensions, ScrollView, Text, Image, View, TouchableHighlight, NativeModules } from 'react-native';
import { Card, List, ListItem, Button, Icon } from 'react-native-elements';
import  Modal from 'react-native-modal';
import HelpModal from '../components/HelpModal';

class Song extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      isModalVisible: false,
      feature: 'none'
    }
    
    this.toggleHelpModal = this.toggleHelpModal.bind(this); 

    //console.log(song);
    //console.log(features);
  }

    /** Header Config */
    static navigationOptions = {
      title: 'Song Details',
      headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
      headerStyle: { backgroundColor: '#222222' },
      headerTintColor: '#ffffff',
      headerRight: (<View></View>)
      
    };

 

  // Display the proper time for duration attribute
  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  // Display the proper note for key attribute
  convertKey(note){
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
  toggleHelpModal(id) { 
    console.log("IS modal visible?  ", this.state.isModalVisible);
    
    this.setState({ isModalVisible: !this.state.isModalVisible, feature: id });
  }

  render() {
    const styles = {
      
      /** VIEW CONTAINERS **/
      containerStyle: {
        backgroundColor: '#222222'
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
        color: '#222222',
        fontSize: 16 
      },
      header: {
        color: '#ffffff',
        fontSize: 20,
        textAlign: 'center'
      },
    
      /** BUTTONS **/
      buttonContainer: { 
        marginTop: 20
      },
      iconStyle: {
        name: 'help-outline',
        color: '#1ed760', 
        size: 16
      }
    };

    const { params } = this.props.navigation.state;
    const song = params.song;
    const features = params.features;
    const playSong = params.playSong;

    let mode;
      if (features.mode === 0 ) mode = ' Minor';
      else mode = ' Major';


    return (
      
      <ScrollView style={styles.containerStyle}>
        
        <View style={{ flexDirection:'row', justifyContent: 'center', margin: 0, paddingTop: 10 }}>
          <Text style={{ color: '#ffffff', paddingRight: 10, margin:0 }}>Scroll down for details</Text>
          <Icon name='angle-down' type='font-awesome' color='#ffffff'/>
        </View>
        
        <Card containerStyle={{ marginTop:5, marginBottom: 25 }}>

          {/* Album Image */}
          <View style={{height: 300}}>
            <Image
              style={{width: 300, height: 300}}
              resizeMode='cover'
              source={{ uri: song.album.images[1].url }}
              />
          </View>

          {/* Save Song Button */}
          <Button
          raised
            icon={{name: 'arrow-circle-o-down', type: 'font-awesome'}}
            backgroundColor='#ff2525'
            fontFamily='Lato'
            containerViewStyle={styles.buttonContainer}
            onPress={() => params.saveTracks([song.id]) }
            title='SAVE TO LIBRARY' />



          

          {/* List of Song Details */}
          <List>
            <ListItem
              title={ song.name }
              titleStyle={styles.title}
              subtitle='Track'
              rightIcon={{name: 'play', type: 'font-awesome', color: '#222222'}}
              onPressRightIcon={() => NativeModules.SpotifyAuth.playSong(song.uri)}
            />
            <ListItem
              title={ song.artists[0].name }
              titleStyle={styles.title}
              subtitle='Artist'
              hideChevron={true}
            />
            <ListItem
              title={ song.album.name }
              titleStyle={styles.title}
              subtitle='Album'
              hideChevron={true}
            />
            <ListItem
              title='Duration'
              titleStyle={styles.title}
              rightTitle={ this.millisToMinutesAndSeconds(song.duration_ms) }
              hideChevron={true}
            />
            <ListItem
              title='Key'
              titleStyle={styles.title}
              rightTitle={ this.convertKey(features.key) + mode}
              hideChevron={true}
            />
            <ListItem
              title='Loudness'
              titleStyle={styles.title}
              rightTitle={ (Math.round(features.loudness * 10) / 10).toFixed(1) + ' dB' }
              hideChevron={true}
            />
            <ListItem
              title='Time Signature'
              titleStyle={styles.title}
              rightTitle={ features.time_signature + ' beats/measure' }
              hideChevron={true}
            />
            <ListItem
              title='Tempo'
              titleStyle={styles.title}
              rightTitle={ (Math.round(features.tempo * 10) / 10).toFixed(1) + ' bpm' }
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
              leftIconOnPress={ () => this.toggleHelpModal("ac") }
              title='Acousticness'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.acousticness * 100) + ' / 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("dnc") }
              title='Danceability'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.danceability * 100) + ' / 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("en") }
              title='Energy'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.energy * 100) + ' / 100' }
              hideChevron={true}
            />           
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("inst") }
              title='Instrumentalness'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.instrumentalness * 100) + ' / 100' }
              hideChevron={true}
            />          
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("live") }
              title='Liveness'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.liveness * 100) + ' / 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("pop") }
              title='Popularity'
              titleStyle={styles.title}
              rightTitle={ song.popularity + ' / 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("sp") }
              title='Speechiness'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.speechiness * 100) + ' / 100' }
              hideChevron={true}
            />
            <ListItem
              leftIcon={styles.iconStyle}
              leftIconOnPress={ () => this.toggleHelpModal("val") }
              title='Valence'
              titleStyle={styles.title}
              rightTitle={ Math.floor(features.valence * 100) + ' / 100' }
              hideChevron={true}
            />           
          </List>
        </Card>     
      </ScrollView>
    );
  }
}

export default Song;
