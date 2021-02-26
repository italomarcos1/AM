import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import EmptyBagIcon from '~/assets/empty-bag.svg';

import api from '~/services/api';

import {
  ActivityIndicatorContainer,
  Container,
  FinishButton,
  FinishButtonText,
  ProductsListContainer,
  ProductsList,
  ProductItem,
  ProductInfoRow,
  ProductInfoColumn,
  ProductImage,
  ProductTitle,
  PriceContainer,
  OldPrice,
  CurrentPrice,
  DiscountPercent,
  ProductBottomRow,
  QuantityContainer,
  Quantity,
  RemoveButton,
  RemoveButtonText,
  Total,
  EmptyBagContainer,
  EmptyBagText,
  EmptyBagTitle,
  TotalLabel,
  TotalPrice,
} from './styles';

import Header from '~/components/HeaderMenu';

import {
  removeFromCartRequest,
  updateAmount,
} from '~/store/modules/cart/actions';
import { showTabBar, resetTrigger } from '~/store/modules/user/actions';

Icon.loadFont();

export default function ShoppingBag() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const products = useSelector(state => state.cart.products);
  const signed = useSelector(state => state.auth.signed);

  const [totalBag, setTotalBag] = useState(0);
  const [loadingBag, setLoadingBag] = useState(false);

  const [minimalPurchaseValue, setMinimalPurchaseValue] = useState(0);
  const [canContinue, setCanContinue] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(showTabBar());
    }, [])
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const calculateTotalPrice = useCallback(() => {
    const total = products.reduce((totalSum, product) => {
      return (
        totalSum +
        (product.has_promotion ? product.price_promotional : product.price) *
         product.qty
      );
    }, 0);

    const formattedPrice = Number(total).toFixed(2);

    setTotalBag(formattedPrice);
  }, [products]);

  const handleRemoveFromCart = useCallback(
    async id => {
      setLoadingBag(true);

      await dispatch(removeFromCartRequest(id));

      setTimeout(() => {
        setLoadingBag(false);
      }, 200);
    },
    [dispatch]
  );

  const retrieveMinimalPurchaseValue = useCallback(async () => {
    try {
      setLoadingBag(true);
      const { data } = await api.get('checkout/minimal-purchase');

      setMinimalPurchaseValue(data.data);

      setLoadingBag(false);
    } catch (err) {
      setLoadingBag(false);
    }
  }, []);

  const handleNavigateToCheckout = useCallback(async () => {
    navigation.navigate(signed ? 'Checkout' : 'Auth');
  }, [navigation, signed]);

  const handleUpdateAmount = useCallback(async (id, amount) => {
    if (amount > 0) dispatch(updateAmount(id, amount));
  }, []);

  useEffect(() => {
    retrieveMinimalPurchaseValue();
    calculateTotalPrice();

    dispatch(resetTrigger());
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [products, calculateTotalPrice]);

  useEffect(() => {
    setCanContinue(Number(totalBag) > Number(minimalPurchaseValue));
  }, [minimalPurchaseValue, totalBag, retrieveMinimalPurchaseValue]);

  function getPercentDiscountValue(product) {
    const { price, price_promotional } = product;

    return Math.ceil(((price - price_promotional) / price) * 100);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header title="Cesto de compras" close={handleGoBack} custom={true} />

      <Container>
        {products.length === 0 && (
          <EmptyBagContainer>
            <EmptyBagIcon width={200} height={200} />
            <EmptyBagTitle>Não há itens no cesto!</EmptyBagTitle>
            <EmptyBagText>
              Por favor, adicione item e volte no cesto de compras.
            </EmptyBagText>
          </EmptyBagContainer>
        )}

        {products.length !== 0 && (
          <>
            {loadingBag && (
              <ActivityIndicatorContainer>
                <ActivityIndicator size={50} color="#12b118" />
              </ActivityIndicatorContainer>
            )}

            <ProductsListContainer>
              <ProductsList
                data={products}
                keyExtractor={product => String(product.id)}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: product }) => (
                  <ProductItem>
                    <ProductInfoRow>
                      <ProductImage source={{ uri: product.thumbs }} />

                      <ProductInfoColumn>
                        <ProductTitle>{product.title}</ProductTitle>
                        <PriceContainer>
                          {product.has_promotion ? (
                            <>
                              <OldPrice>€ {product.price}</OldPrice>

                              <CurrentPrice>
                                € {product.price_promotional}
                              </CurrentPrice>

                              <DiscountPercent>{`-${getPercentDiscountValue(
                                product
                              )}%`}</DiscountPercent>
                            </>
                          ) : (
                            <CurrentPrice>€ {product.price}</CurrentPrice>
                          )}
                        </PriceContainer>
                      </ProductInfoColumn>
                    </ProductInfoRow>

                    <ProductBottomRow>
                      <RemoveButton
                        onPress={() => handleRemoveFromCart(product.id)}
                      >
                        <RemoveButtonText>Excluir</RemoveButtonText>
                        <Icon name="x" size={22} color="#9A9A9A" />
                      </RemoveButton>

                      <QuantityContainer>
                        <TouchableOpacity
                          onPress={() =>
                            handleUpdateAmount(product.id, product.qty - 1)
                          }
                        >
                          <Icon name="minus" size={22} color="#9a9a9a" />
                        </TouchableOpacity>

                        <Quantity>{product.qty}</Quantity>

                        <TouchableOpacity
                          onPress={() =>
                            handleUpdateAmount(product.id, product.qty + 1)
                          }
                        >
                          <Icon name="plus" size={22} color="#9a9a9a" />
                        </TouchableOpacity>
                      </QuantityContainer>

                      <Total>
                          €{' '}
                          {(
                            product.qty * 
                            (product.has_promotion
                              ? product.price_promotional
                              : product.price)
                          ).toFixed(2)}
                      </Total>
                    </ProductBottomRow>
                  </ProductItem>
                )}
              />
            </ProductsListContainer>

            {!canContinue && (
              <TotalLabel>
                Total: <TotalPrice>€ {Number(totalBag).toFixed(2)}</TotalPrice>
              </TotalLabel>
            )}

            <FinishButton
              canContinue={canContinue}
              onPress={() => {
                if (canContinue) handleNavigateToCheckout();
              }}
            >
              <FinishButtonText>
                {canContinue
                  ? `Finalizar compra | € ${Number(totalBag).toFixed(2)}`
                  : `De momento o valor mínimo para encomendas é de € ${minimalPurchaseValue}`}
              </FinishButtonText>
            </FinishButton>
          </>
        )}
      </Container>
    </>
  );
}
