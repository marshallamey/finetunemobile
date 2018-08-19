import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CheckBox, Icon, Button } from 'react-native-elements'

const SearchByArtist = (props) => {

  return (
    <View style={styles.inputView}>
          <Text style={styles.header}>Search by Artist</Text>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid='transparent'
              placeholder="Enter an artist"
              placeholderTextColor="#aaaaaa"
              autoCorrect={false}
              onChangeText={(text) => this.setState({text})}
            />
          </View>
  );

}
export default SearchByArtist;