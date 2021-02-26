import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

export default function CustomModal({
  visible,
  loading,
  children,
  modalTitle,
  closeText,
  onClosePress,
  actionText,
  onActionPress,
  hideCloseButton,
  hideActionButton,
}) {
  const { width, height } = Dimensions.get('window');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width,
          flexDirection: 'column',
          backgroundColor: 'transparent',
        }}
      >
        <TouchableHighlight
          onPress={onClosePress}
          style={{
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            opacity: 0.8,
            position: 'absolute',
            width,
            height,
            left: 0,
            top: 0,
          }}
          underlayColor="transparent"
        >
          <Text />
        </TouchableHighlight>

        <View
          style={{
            width: width - 48,
          }}
        >
          <View
            style={{
              borderRadius: 4,
              justifyContent: 'center',
              backgroundColor: 'white',
              padding: 20,
              paddingTop: 10,
              paddingBottom: 20,
              position: 'relative',
              maxHeight: height - 140,
            }}
          >
            {loading && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  zIndex: 2,
                }}
              >
                <ActivityIndicator size={40} color="#12b118" />
              </View>
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#000',
                marginBottom: 10,
              }}
            >
              {modalTitle}
            </Text>

            {children}

            <View
              style={{
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}
            >
              {!hideCloseButton && (
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    marginRight: 10,
                  }}
                  onPress={onClosePress}
                >
                  <Text
                    style={{
                      color: '#999',
                      textTransform: 'uppercase',
                    }}
                  >
                    {closeText}
                  </Text>
                </TouchableOpacity>
              )}

              {!hideActionButton && (
                <TouchableOpacity
                  style={{
                    marginTop: 20,
                    marginLeft: 10,
                  }}
                  onPress={onActionPress}
                >
                  <Text
                    style={{
                      color: '#12b118',
                      textTransform: 'uppercase',
                    }}
                  >
                    {actionText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

CustomModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  modalTitle: PropTypes.string,
  closeText: PropTypes.string,
  onClosePress: PropTypes.func.isRequired,
  actionText: PropTypes.string,
  onActionPress: PropTypes.func.isRequired,
  hideCloseButton: PropTypes.bool,
  hideActionButton: PropTypes.bool,
};

CustomModal.defaultProps = {
  visible: false,
  loading: false,
  modalTitle: '',
  closeText: 'Cancelar',
  actionText: 'Salvar',
  hideCloseButton: false,
  hideActionButton: false,
};
