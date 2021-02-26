import React, { useState, useEffect } from 'react';
import { Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import PropTypes from 'prop-types';

import {
  addToFavoritesRequest,
  removeFromFavoritesRequest,
} from '~/store/modules/cart/actions';

import FavoriteOn from '~/assets/heart-on.svg';
import FavoriteOff from '~/assets/heart-off.svg';
import PlaceholderImage from '~/assets/placeholder.svg';
import Auth from '~/pages/Auth';

import {
  Container,
  ImageContainer,
  ItemImage,
  ButtonFavorite,
  InformationContainer,
  Title,
  PriceContainer,
  OldPrice,
  OldPriceLabel,
  CurrentPrice,
} from './styles';

export default function ProductItem({ item, closeModal }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { title, thumbs, price, price_promotional, has_promotion } = item;

  const signed = useSelector(state => state.auth.signed);
  const favorites = useSelector(state => state.cart.favorites);
  const updating = useSelector(state => state.cart.updating);
  const [favorite, setFavorite] = useState(false);

  const [loginVisible, setLoginVisible] = useState(false);

  useEffect(() => {
    const fvt = favorites.findIndex(fav => fav.id === item.id);
    setFavorite(fvt >= 0);
  }, [signed, favorites]);

  const handleFavorite = () => {
    if (!signed) {
      setLoginVisible(true);
    } else {
      dispatch(
        !favorite
          ? addToFavoritesRequest(item.id)
          : removeFromFavoritesRequest(item.id)
      );
      setFavorite(!favorite);
    }
  };

  return (
    <>
      <Container
        onPress={() => {
          closeModal();
          navigation.navigate('Product', { item });
        }}
      >
        <ImageContainer>
          {!thumbs ? (
            <PlaceholderImage width="100%" height={165} />
          ) : (
            <ItemImage source={{ uri: thumbs }} resizeMode="cover" />
          )}

          <ButtonFavorite
            hitSlop={{
              top: 10,
              bottom: 20,
              left: 10,
              right: 20,
            }}
            onPress={handleFavorite}
            disabled={updating}
          >
            {favorite ? <FavoriteOn width={30} /> : <FavoriteOff width={30} />}
          </ButtonFavorite>
        </ImageContainer>

        <InformationContainer>
          <Title>{title}</Title>

          <PriceContainer>
            <>
              {has_promotion ? (
                <>
                  <OldPrice>€ {price}</OldPrice>
                  <OldPriceLabel>por</OldPriceLabel>
                  <CurrentPrice>{`€ ${price_promotional}`}</CurrentPrice>
                </>
              ) : (
                <CurrentPrice>{`€ ${price}`}</CurrentPrice>
              )}
            </>
          </PriceContainer>
        </InformationContainer>
      </Container>
      <Modal visible={loginVisible} closeModal={() => setLoginVisible(false)}>
        <Auth closeModal={() => setLoginVisible(false)} />
      </Modal>
    </>
  );
}

ProductItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  closeModal: PropTypes.func,
};

ProductItem.defaultProps = {
  closeModal: () => {},
};
