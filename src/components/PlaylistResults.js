import React, { Component } from 'react';
import { ScrollView, Image, View, Text, Button } from 'react-native';
import { ListItem } from 'react-native-elements'
import SongResult from './SongResult';

export default class PlaylistResults extends React.Component {

  render() {

    const { params } = this.props.navigation.state;
    const songs = params.songs;
    const features = params.features;
    console.log(songs);
    console.log(features);
    

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

    /** Create a list of tracks returned from Spotify API
     * Use the song ID as the key for each new song component
     * Each track is a property of the song component */
    const tracks = songs.map((song, index) => {   
      return <ListItem 
        key={ song.id } 
        avatar={{ uri: song.album.images[1].url }}
        title={ song.name }
        subtitle={ song.artists[0].name } 
        rightTitle='Details'
        onPressRightIcon={ () => this.props.navigation.navigate('SongDetail', {
          song: song, 
          features: features[index],
          createNewPlaylist: params.createNewPlaylist,
          saveTracks: params.saveTracks,
          playSong: params.playSong
        })}
      />
    });

    const song_uris = songs.map( song => {   
      return song.uri
    })
    console.log("(6) SONGURIS TO CREATE PLAYLIST: ", song_uris);  


    return (     
      <ScrollView >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Playlist Results Page</Text>
        </View>

        <View>
          { tracks }
        </View>


      </ScrollView>
    );
  }
}