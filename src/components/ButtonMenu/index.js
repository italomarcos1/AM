import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { CustomButton, ButtonText } from './styles';

export default function ButtonMenu({
  disabled,
  style,
  loading,
  children,
  ...rest
}) {
  return (
    <CustomButton disabled={disabled} style={style} {...rest}>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <ButtonText>{children}</ButtonText>
      )}
    </CustomButton>
  );
}

ButtonMenu.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object]),
  children: PropTypes.string.isRequired,
};

ButtonMenu.defaultProps = {
  disabled: false,
  loading: false,
  style: {},
};
