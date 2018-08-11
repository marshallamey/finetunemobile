import React from 'react';
import { Image, View, Text, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import logo from '../img/finetune-banner-logo.jpg';
import Header from './Header';

export default class HomePage extends React.Component {

  

  render() {
    const styles = {
      viewStyle: {
        backgroundColor: '#000000',
        alignItems: 'center',
        flex: 1
      },
      bodyStyle: {
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'stretch',
        flex: 1
      },
      imgdivStyle: {
        width: 300, 
        height: 165,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
  
  
      },
      imageStyle: { 
        width: 300, 
        height: 170,
      }
    };
    return (
      <View style={styles.viewStyle}>

        <Header headerText={'FineTune Pro'} />

        <View style={styles.imgdivStyle}>
          <Image source={logo} style={styles.imageStyle} />
        </View>   

        <View style={styles.bodyStyle}>
          <Text>Body</Text>
          <Button
          title="Search for Music"
          onPress={() => this.props.navigation.navigate('Search')}
        />
        <Button
          title="See Results"
          onPress={() => this.props.navigation.navigate('Results')}
        />
        </View>

      </View>
    );
  }
}