import React from 'react';
import { AppRegistry, YellowBox } from 'react-native';
// You have access to three classes in this module:

import App from './src/components/App';



YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

AppRegistry.registerComponent('finetunemobile', () => App);
