import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Favorites from './index';
import Product from '~/components/Product';

export default function Routes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator headerMode="none" initialRouteName="Favorites">
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Product" component={Product} />
    </Stack.Navigator>
  );
}
