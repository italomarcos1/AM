import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

import { Container, CurrentPageButton, CurrentPageText } from './styles';

Icon.loadFont();

export default function BreadCrumb({ name }) {
  const navigation = useNavigation();
  return (
    <Container>
      <CurrentPageButton onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={25} color="#999" />
        <CurrentPageText>{name}</CurrentPageText>
      </CurrentPageButton>
    </Container>
  );
}

BreadCrumb.propTypes = {
  name: PropTypes.string.isRequired,
};
