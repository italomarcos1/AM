import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './index';
import Product from '~/components/Product';
import Menu from '~/components/Menu';
import Category from '~/components/Category';
import ChildrenCategory from '~/components/ChildrenCategory';
import Content from '~/components/Content';

export default function Routes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator headerMode="none" initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="Category" component={Category} />
      <Stack.Screen name="ChildrenCategory" component={ChildrenCategory} />
      <Stack.Screen name="Content" component={Content} />
    </Stack.Navigator>
  );
}
