import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import HomePage from './Home';

import Playlists from './Playlists';
import PlaylistSearch from './PlaylistSearch';
import PlaylistResults from './PlaylistResults';
import SongSearch from './SongSearch';
import SongResult from './SongResult';


const RootStack = createStackNavigator(
  {
    Home: HomePage,
    ListSearch: PlaylistSearch,
    ListResults: PlaylistResults,
    SongSearch: SongSearch,
    SongResult: SongResult,
    Playlists: Playlists
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



