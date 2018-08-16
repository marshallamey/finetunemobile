import React, { Component } from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import SongDetail from '../screens/SongDetailScreen';

import Playlists from './Playlists';
import PlaylistSearch from './PlaylistSearch';
import PlaylistResults from './PlaylistResults';
import SongSearch from './SongSearch';
import SongResult from './SongResult';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    ListSearch: PlaylistSearch,
    ListResults: PlaylistResults,
    SongSearch: SongSearch,
    SongDetail: SongDetail,
    Playlists: Playlists
  },
  {
    initialRouteName: 'Home'
  }
);

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: AppStack    
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  };
};



