import React from 'react';
import { StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';

import Transactions from './index';

import Details from './pages/Details';

import Header from '~/components/HeaderMenu';

import { resetOrder } from '~/store/modules/user/actions';

Icon.loadFont();

export default function Routes() {
  const Stack = createStackNavigator();
  const dispatch = useDispatch();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5BAE59" />
      <Stack.Navigator
        initialRouteName="Orders"
        screenOptions={({ navigation }) => ({
          header: () => (
            <Header
              title="Minhas encomendas"
              close={() => navigation.goBack()}
            />
          ),
        })}
      >
        <Stack.Screen name="Orders" component={Transactions} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={({ navigation, route }) => ({
            header: () => (
              <Header
                title={`Encomenda ${route.params.id}`}
                close={() => {
                  navigation.goBack();
                  dispatch(resetOrder());
                }}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </>
  );
}

Routes.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    openDrawer: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
