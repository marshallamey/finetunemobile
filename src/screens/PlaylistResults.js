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
      albumCover = song.album.images[1].url ? 
        song.album.images[1].url 
      : 
        <Image 
          source={require('../img/finetune-square-border-logo.jpg')}
          width={300}
          height={300}
        />;

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
          subtitle={ song.artists[0].name } 
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
      <ScrollView >

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
          <SavePlaylistForm songs={songs} createNewPlaylist={params.createNewPlaylist} />
        </View>

        <View>
          { tracks }
        </View>

      </ScrollView>
    );
  }
}
