import React from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

import AddMail from './pages/AddMail';
import VerifyMail from './pages/VerifyMail';

export default function Account() {
  const user = useSelector(state => state.user.profile);

  return user.email === null ? <AddMail /> : <VerifyMail />;
}

Account.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};
