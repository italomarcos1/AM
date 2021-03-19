import React from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Bag from './index';
import Checkout from './pages/Checkout';
import Auth from '~/pages/Auth';
import PurchaseConfirmation from './pages/PurchaseConfirmation';

export default function Routes() {
  const Stack = createStackNavigator();

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="light-content" />
      <Stack.Navigator initialRouteName="Bag" headerMode="none">
        <Stack.Screen name="Bag" component={Bag} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen
          name="PurchaseConfirmation"
          component={PurchaseConfirmation}
        />
      </Stack.Navigator>
    </>
  );
}
