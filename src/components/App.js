import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import reducers from '../reducers';

import HomeScreen from '../screens/HomeScreen';
import SongDetail from '../screens/SongDetailScreen';
import Playlists from '../screens/Playlists';
import PlaylistSearch from '../screens/PlaylistSearch';
import PlaylistResults from '../screens/PlaylistResults';
import SongSearch from '../screens/SongSearch';



const RootStack = createStackNavigator(
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


export default class App extends Component {
  render() {
    return( 
      <Provider store={createStore(reducers)}>
        <RootStack />
      </Provider> 
    );
  };
};



