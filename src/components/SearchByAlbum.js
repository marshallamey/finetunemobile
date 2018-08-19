import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CheckBox, Icon, Button } from 'react-native-elements'

const SearchByAlbum = (props) => {

  return (
    <View style={styles.inputView}>
          <Text style={styles.header}>Search by Album</Text>
            <TextInput
              style={styles.inputs}
              underlineColorAndroid='transparent'
              placeholder="Enter an album"
              placeholderTextColor="#aaaaaa"
              autoCorrect={false}
              onChangeText={(text) => this.setState({text})}
            />
          </View>
  );

}
export default SearchByAlbum;