import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  ImageContainer,
  ItemImage,
  InformationContainer,
  Title,
} from './styles';

import PlaceholderImage from '~/assets/placeholder.svg';

export default function ContentItem({ item }) {
  const navigation = useNavigation();

  const { id, title, thumbs } = item;

  return (
    <Container
      onPress={() =>
        navigation.navigate('Content', {
          endpoint: `blog/contents/${id}`,
          title,
        })
      }
    >
      <ImageContainer>
        {!thumbs ? (
          <PlaceholderImage width="100%" height={165} />
        ) : (
          <ItemImage source={{ uri: thumbs }} resizeMode="cover" />
        )}
      </ImageContainer>

      <InformationContainer>
        <Title>{title}</Title>
      </InformationContainer>
    </Container>
  );
}

ContentItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
