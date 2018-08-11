import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from './Home';
import MusicList from './MusicList';
import MusicSearchForm from './MusicSearchForm';

const RootStack = createStackNavigator(
  {
    Home: HomePage,
    Search: MusicSearchForm,
    Results: MusicList
  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  };
};



