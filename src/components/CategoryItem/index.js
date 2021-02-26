import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import PlaceholderImage from '~/assets/placeholder.svg';

import {
  Container,
  ImageContainer,
  ItemImage,
  InformationContainer,
  Title,
} from './styles';

export default function CategoryItem({ item }) {
  const navigation = useNavigation();

  const { name, thumbs } = item;

  return (
    <Container
      onPress={() => {
        if (item.all_children_categories.length !== 0) {
          navigation.navigate('ChildrenCategories', {
            items: item.all_children_categories,
            name: item.name,
          });
        } else {
          navigation.navigate('Products', { id: item.id, name: item.name });
        }
      }}
    >
      <ImageContainer>
        {!thumbs ? (
          <PlaceholderImage width="100%" height={130} />
        ) : (
          <ItemImage source={{ uri: thumbs }} resizeMode="cover" />
        )}
      </ImageContainer>

      <InformationContainer>
        <Title>{name}</Title>
      </InformationContainer>
    </Container>
  );
}

CategoryItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
