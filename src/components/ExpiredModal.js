import React from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';

const styles = {
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContainer: {
    flex: 1,
  },
};

const ExpiredModal = (props) => {
  return (

    <View style={styles.modalContainer}>
      <Modal
        transparent={true}
        isVisible={props.expiredAlert}
        backdropColor={'#222222'}
        backdropOpacity={0.8}
        animationIn={'zoomInDown'}
        animationOut={'zoomOutUp'}
      >
        <View style={styles.modalContent}>

          <Text style={{ fontSize: 24, textAlign: 'center' }}>
            Spotify token expired.  Refreshing...
          </Text>

        </View>
      </Modal>
    </View>
  );
};

export default ExpiredModal;
