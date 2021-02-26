import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import HomeStackNavigation from '~/pages/App/Home/routes';
import ShoppingBag from '~/pages/App/ShoppingBag/routes';
import FavoritesScreen from '~/pages/App/Favorites/routes';
import AccountScreen from '~/pages/App/Account/routes';
import ContentScreen from '~/pages/App/Content';

export default function Routes() {
  const Tab = createBottomTabNavigator();
  const visible = useSelector(state => state.user.tabBar);
  function generateIcon(iconName, color) {
    return <Icon name={iconName} size={25} color={color} />;
  }

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          activeTintColor: '#12b118',
          inactiveTintColor: '#333',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigation}
          options={() => ({
            tabBarLabel: 'Produtos',
            tabBarIcon: ({ color }) => generateIcon('home', color),
          })}
        />

        <Tab.Screen
          name="Lojas"
          component={ContentScreen}
          initialParams={{ contentId: 7 }}
          options={() => ({
            tabBarLabel: 'Lojas',
            tabBarIcon: ({ color }) => generateIcon('map-pin', color),
          })}
        />

        <Tab.Screen
          name="ShoppingBag"
          component={ShoppingBag}
          options={() => ({
            tabBarLabel: 'Cesto',
            tabBarVisible: visible,
            tabBarIcon: ({ color }) => generateIcon('shopping-bag', color),
          })}
        />

        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={() => ({
            tabBarLabel: 'Favoritos',
            tabBarIcon: ({ color }) => generateIcon('star', color),
          })}
        />

        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={() => ({
            title: 'Conta',
            tabBarVisible: visible,
            tabBarIcon: ({ color }) => generateIcon('user', color),
          })}
        />
      </Tab.Navigator>
    </>
  );
}
