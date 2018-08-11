import { View, Text } from 'react-native';
import React from 'react';



const Header = (props) => {
  return (
    <View style={styles.headerStyle}>
      <Text style={styles.textStyle}>{props.headerText}</Text> 
    </View>
  );
};

const styles = {

  headerStyle: {
    backgroundColor: '#000000',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20,
    color: '#ff2525',
  }
};
export default Header;
