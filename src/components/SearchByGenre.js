import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { View, Text, } from 'react-native';
import { CheckBox, Icon, Button } from 'react-native-elements';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const SearchByGenre = (props) => {

  return (
    <View style={ styles.inputView }>
      <Text style={ styles.header }>Step 1: Search by Genre</Text>
      <SectionedMultiSelect
        items={ props.allGenres } 
        uniqueKey='name'
        selectText="Select up to 5 genres"
        loadingComponent={ <Text>Sorry, no results</Text> }
        onSelectedItemsChange={ (event) => props.selectGenre(event) }
        selectedItems={ props.selectedGenres }
        alwaysShowSelectText={ true }
        showDropDowns={ true }
        showCancelButton={ true }
        styles={{
          container: {
            flexGrow: 1,
            alignItems: 'stretch',
            justifyContent: 'center'            
          },
          selectToggle: {
            paddingBottom: 10,
            paddingLeft: 5
          },
          chipContainer: {
            backgroundColor: '#1ed760'
          },
          chipText: {
            color: '#ffffff'
          },
          chipIcon: {
            color: '#ffffff'
          },
       
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
  inputView: {
    backgroundColor: '#333333',
    padding: 20,
    marginBottom: 20,      
  },
  header: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 20
  }
};
const mapStateToProps = state => {
  return { 
    allGenres: state.allGenres,
    selectedGenres: state.selectedGenres,
    selectGenre: state.selectGenre
  }
};
export default connect(mapStateToProps, actions)(SearchByGenre);