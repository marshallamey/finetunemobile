import React, { Component } from 'react';

import { View, Text, TouchableOpacity } from 'react-native';
import  Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import featuresDesc from '../js/featuresDesc';

const HelpModal = (props) => {
  return(

    <View style={styles.modalContainer}>
      <Modal
        transparent={true}
        isVisible={props.isModalVisible}
        backdropColor={'#222222'}
        backdropOpacity={0.8}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'} 
      >
        <View style={styles.modalContent}>
            
            {/* Modal Header and Close Icon */}
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, paddingLeft: 20, paddingRight: 20, borderBottomColor: '#aaaaaa', borderBottomWidth: 1}}>
              <Text style={{fontSize: 18 }}>{featuresDesc[props.feature].name}</Text>
              <TouchableOpacity
                onPress={() => {
                  props.toggleHelpModal('none');
                }} >
                <Icon 
                  name='close' 
                  color='#1ed760' 
                  size={20} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Modal Body */}
            <View style={{padding: 20}}>
              <Text style={{ fontSize: 16, lineHeight: 22 }}>{featuresDesc[props.feature].desc}</Text>
            </View> 

        </View>               
      </Modal>
    </View>
  );
}

const styles = {
  modalContent: {
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    flex: 1,
  }
}

export default HelpModal;