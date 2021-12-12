import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { Container, Title, Subtitle, ViewOrder } from './styles';

import Image from '~/assets/purchase-confirmation.svg';

import { cleanCart } from '~/store/modules/cart/actions';
import { viewOrder } from '~/store/modules/user/actions';

export default function PurchaseConfirmation({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const products = useSelector(state => state.cart.products);

  const { message } = route.params;

  useEffect(() => {
    dispatch(cleanCart());

    setTimeout(function () {
      navigation.popToTop();
    }, 3500);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Bag');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleDispath = useCallback(() => {
    dispatch(viewOrder());
    navigation.navigate('Account');
  }, []);

  return (
    <Container>
      <Image width={250} height={250} />

      <Title>Agradecemos a sua encomenda!</Title>

      <Subtitle>{message}</Subtitle>

      <ViewOrder
        onPress={() => {
          handleDispath();
        }}
      >
        Visualizar a encomenda
      </ViewOrder>
    </Container>
  );
}
