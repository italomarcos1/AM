import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-tiny-toast';

import EmptyListIcon from '~/assets/empty-wishlist.svg';

import ProductItem from '~/components/ProductItem';
import Header from '~/components/HeaderMenu';

import AuthScreen from '~/pages/Auth';

import {
  Container,
  AddToCartButton,
  AddToCartButtonText,
  FavoritesList,
  EmptyListContainer,
  EmptyListTitle,
  EmptyListText,
  LoadingContainer,
  Loading,
  LoadingText,
} from './styles';

import api from '~/services/api';
import { showTabBar, resetTrigger } from '~/store/modules/user/actions';
import { addToCartRequest } from '~/store/modules/cart/actions';

export default function Favorites() {
  const signed = useSelector(state => state.auth.signed);
  const isTabBarHide = !useSelector(state => state.auth.signed);

  const favorites = useSelector(state => state.cart.favorites);

  const [apiFavorites, setApiFavorites] = useState(favorites);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const loadFavorites = useCallback(async () => {
    const {
      data: { data },
    } = await api.get('clients/wishlists');

    setApiFavorites(data);
    setLoading(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (signed) {
        dispatch(resetTrigger());
        loadFavorites();
      }

      if (isTabBarHide) dispatch(showTabBar());

      return () => {};
    }, [loadFavorites, signed])
  );

  useEffect(() => {
    if (signed) loadFavorites();
  }, [favorites, signed]);

  const closeModal = async () => {
    navigation.goBack();
  };

  function handleAddAllToCart() {
    Object.entries(apiFavorites).map(([key, product]) => {
      dispatch(addToCartRequest(product, 1));
    });

    Toast.showSuccess('Todos os produto foram\n adicionados ao cesto');
  }

  if (!signed) return <AuthScreen closeModal={closeModal} />;

  if (loading)
    return (
      <>
        <Header
          title="Produtos Favoritos"
          close={() => navigation.navigate('Home')}
          custom={true}
        />

        <Container>
          <LoadingContainer>
            <Loading />
            <LoadingText>Carregando favoritos...</LoadingText>
          </LoadingContainer>
        </Container>
      </>
    );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Header
        title="Produtos Favoritos"
        close={() => navigation.navigate('Home')}
        custom={true}
      />

      <Container>
        {favorites.length !== 0 ? (
          <>
            <FavoritesList
              showsVerticalScrollIndicator={false}
              data={apiFavorites}
              numColumns={2}
              keyExtractor={favorite => String(favorite.id)}
              renderItem={({ item }) => <ProductItem item={item} />}
            />

            <AddToCartButton onPress={() => handleAddAllToCart()}>
              <AddToCartButtonText>
                Adicionar todos ao cesto
              </AddToCartButtonText>
            </AddToCartButton>
          </>
        ) : (
          <EmptyListContainer>
            <EmptyListIcon width={200} height={200} />
            <EmptyListTitle>Não há itens favoritos!</EmptyListTitle>
            <EmptyListText>Produtos favoritos aparecem aqui.</EmptyListText>
          </EmptyListContainer>
        )}
      </Container>
    </>
  );
}
