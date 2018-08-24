import React from 'react';
import { View } from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';

const SavePlaylistForm = (props) => {
  // A list of URIs to make a playlist
  const songUris = props.songs.map(song => song.uri);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <FormInput
        underlineColorAndroid='transparent'
        placeholder='Name this playlist'
        maxLength={25}
        containerStyle={{
          width: '80%', borderBottomColor: '#ffffff', borderBottomWidth: 1, marginBottom: 20,
        }}
        inputStyle={{ color: '#ffffff', fontSize: 18 }}
        onChangeText={event => props.onNameChange(event)}/>
        
      <Button
        raised
        backgroundColor='#ff2525'
        containerViewStyle={{marginBottom: 20 }}
        icon={{ name: 'arrow-circle-o-down', type: 'font-awesome' }}
        title='SAVE THIS PLAYLIST'
        onPress={() => props.savePlaylist(songUris, props.playlistName)} />
    </View>
  );
};

export default SavePlaylistForm;
