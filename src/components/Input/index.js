import React, { forwardRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

import { Container, CustomInput } from './styles';

Icon.loadFont();

const Input = forwardRef(({ icon, style, selected, ...rest }, ref) => {
  return (
    <Container selected={selected} style={style}>
      {icon && <Icon name={icon} size={16} color="#999" />}
      <CustomInput ref={ref} {...rest} placeholderTextColor="#999" />
    </Container>
  );
});

Input.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selected: PropTypes.bool,
};

Input.defaultProps = {
  icon: null,
  selected: false,
  style: {},
};

Input.displayName = 'Input';

export default Input;
