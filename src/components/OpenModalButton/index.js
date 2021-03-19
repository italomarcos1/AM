import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome';

import { OMButton, OMLabel, OMText } from './styles';

export default function OpenModalButton({ onPress, label, text }) {
  return (
    <OMButton onPress={onPress}>
      <OMLabel>{label}</OMLabel>

      <OMText>{text}</OMText>

      <Icon
        name="chevron-down"
        color="#212121"
        style={{
          position: 'absolute',
          right: 15,
          top: 20,
        }}
        size={15}
      />
    </OMButton>
  );
}

OpenModalButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
