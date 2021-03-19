import React from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import AuthScreen from '~/pages/Auth';
import Main from './pages/Main';

export default function Account({ navigation }) {
  const signed = useSelector(state => state.auth.signed);

  const closeModal = async () => {
    navigation.goBack();
  };

  return signed ? <Main /> : <AuthScreen closeModal={closeModal} />;
}

Account.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};
