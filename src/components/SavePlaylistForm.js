import React from 'react';
import { View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';

export default SavePlaylistForm = (props) => {
  
    // A list of URIs to make a playlist
    //TODO:: SONGS should be edited before this is created and playlist saved
    const song_uris = props.songs.map( song => { return song.uri });
    //console.log("(6) SONGURIS TO CREATE PLAYLIST: ", song_uris); 

  return (
    <View>
      <FormLabel>Name This Playlist</FormLabel>
      <FormInput onChangeText={(event) => this.onNameChange(event)}/>
      <Button
        raised
        icon={{name: 'arrow-circle-o-down', type: 'font-awesome'}}
        title='SAVE THIS PLAYLIST' 
        onPress={() => params.createNewPlaylist(song_uris, this.state.playlistName)} />
    </View>
  );

}