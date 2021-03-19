import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Categories from './index';
import Products from './pages/Products';
import ChildrenCategories from './pages/ChildrenCategories';

export default function Routes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator headerMode="none" initialRouteName="Categories">
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="ChildrenCategories" component={ChildrenCategories} />
    </Stack.Navigator>
  );
}
