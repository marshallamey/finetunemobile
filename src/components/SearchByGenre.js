import React from 'react';
import { View, Text, } from 'react-native';
import { CheckBox, Icon, Button } from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const SearchByGenre = (props) => {

  return (
    <View style={ styles.inputView }>
      <Text style={ styles.header }>Search by Genre</Text>
      <SectionedMultiSelect
        items={ props.spotify_genres } 
        uniqueKey='name'
        selectText="Select up to 5 genres"
        loadingComponent={ <Text>Sorry, no results</Text> }
        onSelectedItemsChange={ (event) => props.onSelectedItemsChange(event) }
        selectedItems={ props.chosen_genres }
        alwaysShowSelectText={ true }
        showDropDowns={ true }
        showCancelButton={ true }
        styles={{
          container: {
            flexGrow: 1,
            alignItems: 'stretch',
            justifyContent: 'flex-start',                
          },
          selectToggle: {
            paddingBottom: 10,
            paddingLeft: 5
          }
        }}
        colors={{
          primary: '#1ed760',
          cancel: '#ff2525',
          text: '#333333',
          selectToggleTextColor: '#aaaaaa'
        }}
      />
    </View>

  );

}

const styles = {
      
  /** VIEW CONTAINERS **/
  containerStyle: {
    backgroundColor: '#222222', 
    justifyContent: 'center',
  },
  requiredAlert: {
    backgroundColor: '#1ed760', 
    padding: 10,
    paddingBottom: 5
  },
  requiredOptions: {
    backgroundColor: '#222222', 
    paddingLeft: 20,            
    paddingRight: 20, 
    paddingBottom: 20           
  },
  inputView: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaaa',       
  },
  viewStyleLight: {  
    backgroundColor: '#333333',   
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    paddingBottom: 10
  },
  viewStyleDark: {    
    backgroundColor: '#222222', 
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
    paddingBottom: 10
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    flex: 1,
  },

  /** HEADERS AND TEXT **/
  title: {
    color: '#1ed760',
    fontSize: 25,
    textAlign: 'center',
    margin: 10
  },
  header: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center'
  },
  subheader: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 10,

  },
  subheader2: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
    paddingBottom: 10
  },
  subheader3: {
    color: '#1ed760',
    fontSize: 15,
    textAlign: 'center',
  },
  inputs: {
    paddingTop: 0,
    paddingBottom: 5,
    color: '#aaaaaa',
    fontSize: 16,
  },

  /** BUTTONS **/
  button: {
    color: '#ffffff',      
    fontSize: 20
  },
  buttonContainer: { 
    marginBottom: 5,
    padding: 10, 
    width: 100,
    borderRadius: 20, 
    backgroundColor: '#ff2525',
    justifyContent: 'center'
  },
  iconSize: 16
};

export default SearchByGenre;