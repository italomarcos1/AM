import React from 'react';
import PropTypes from 'prop-types';
import { Header, Title } from './styles';

export default function Validation({ title }) {
  return (
    <Header>
      <Title>{title}</Title>
    </Header>
  );
}

Validation.propTypes = {
  title: PropTypes.string.isRequired,
};
