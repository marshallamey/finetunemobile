import React from 'react';
import { View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';

export default SavePlaylistForm = (props) => {
  
    // A list of URIs to make a playlist
    const song_uris = props.songs.map( song => { return song.uri });


  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <FormLabel labelStyle={{fontSize: 20, color: '#ffffff'}}>Name This Playlist</FormLabel>
      <FormInput 
        underlineColorAndroid='transparent'
        containerStyle={{width: '80%', borderBottomColor: '#ffffff', borderBottomWidth: 1, marginBottom: 20}}
        inputStyle={{color: '#ffffff', fontSize: 20}}
        onChangeText={(event) => props.onNameChange(event)}/>
      <Button
        raised
        backgroundColor='#ff2525'
        icon={{name: 'arrow-circle-o-down', type: 'font-awesome'}}
        title='SAVE THIS PLAYLIST' 
        onPress={() => props.savePlaylist(song_uris, props.playlistName)} />
    </View>
  );

}