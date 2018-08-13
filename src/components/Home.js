import React from 'react';
import { View } from 'react-native';
import Button from 'react-native-button';

export default class HomePage extends React.Component {

  render() {

    const styles = {
      viewStyle: {
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1
      },
      btnStyle: {
        color: '#ffffff',      
        fontSize: 20
      },
      containerStyle: { 
        padding: 10, 
        marginBottom: 20,
        height: 45, 
        overflow: 'hidden', 
        borderRadius: 4, 
        backgroundColor: '#333333' 
      }
    };

    return (

      <View style={ styles.viewStyle }>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }       
          onPress={ () => this.props.navigation.navigate('ListSearch')  }
        >
          Search for Music
        </Button>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }
          onPress={ () => this.props.navigation.navigate('SongSearch') }
        >
          Get Song Details
        </Button>

        <Button
          style={ styles.btnStyle }
          containerStyle={ styles.containerStyle }
          onPress={ () => this.props.navigation.navigate('Playlists') }
        >
          See Playlists
        </Button>

      </View>

    );
  }
}