import React, { Component } from 'react';
import { ScrollView, Image, View, TouchableOpacity, Text } from 'react-native';
import { ListItem, Icon, Button } from 'react-native-elements'
import Swipeable from 'react-native-swipeable';
import MusicPlayer from '../components/MusicPlayer';
import SavePlaylistForm from '../components/SavePlaylistForm';

export default class PlaylistResults extends Component {

  /** CONSTRUCTOR() */
  constructor(props) {
    super(props);

    this.state = {
        playlistName: '' 
    };  

    this.onNameChange = this.onNameChange.bind(this);
  }

  /* FUNCTION(): Change state of playlistName */
  onNameChange(name) { 
    console.log("Playlist Name: ", name);  
    this.setState({ playlistName: name });        
 }

   /** Header Config */
   static navigationOptions = {
    title: 'Search Results',
    headerTitleStyle: { flex: 1, textAlign: 'center', alignSelf: 'center' },
    headerStyle: { backgroundColor: '#222222' },
    headerTintColor: '#ffffff',
    headerRight: (<View></View>)  
  };

  render() {

    const { params } = this.props.navigation.state;
    const songs = params.songs;
    const features = params.features;
    //console.log(songs);
    //console.log(features);

    const leftButtons = [
      // Delete song button

    ];

    /** Create a list of tracks returned from Spotify API
     * Use the song ID as the key for each new song component
     * Each track is a property of the song component */
     
    let tracks = '';
    let albumCover = '';
    
    
    if(songs.length) { 
      tracks = songs.map((song, index) => {
      
      //If no album cover, use finetune logo
      if (song.album.images[1]) albumCover = song.album.images[1].url; 
      else albumCover = "http://res.cloudinary.com/skooliesocial/image/upload/v1533356615/finetune-square-border-logo_e4hwdv.jpg";

      return (
      <Swipeable 
      key={ song.id }
      leftButtons={[
        <TouchableOpacity 
          style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}
          onPress={() => params.deleteSong(index)}
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
          onPress={ () => params.playSong(index)}
          onPressRightIcon={ () => this.props.navigation.navigate('SongDetail', {
            song: song, 
            features: features[index],
            saveTracks: params.saveTracks,
            playSong: params.playSong,
          })}
        />

      </Swipeable>
      );
    });
  } else {
    console.log("NO MoRE SONGS");
    
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

        <View style={styles.playerStyle}>
          <MusicPlayer 
            pauseSong={params.pauseSong}
            playSong={params.playSong}
            pauseSong={params.pauseSong}
            resumeSong={params.resumeSong}
            playNext={params.playNext}
            playPrevious={params.playPrevious}
            playing={params.playing}
            artistName={params.artistName}
            albumName={params.albumName}
            trackName={params.trackName}
            albumCover={params.albumCover}
            position={params.position }
          />
        </View>

        <View style={styles.formStyle}>
          <SavePlaylistForm 
            songs={songs} 
            createNewPlaylist={params.createNewPlaylist} 
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
  }
}