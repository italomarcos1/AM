import React, { useCallback, useEffect, useState } from 'react';
import { Modal, StatusBar } from 'react-native';
import { useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProgressBar from 'react-native-progress/Bar';

import Toast from 'react-native-tiny-toast';

import Header from '~/components/Header';
import Search from '~/components/Search';

import CategoriesScreen from '~/pages/App/Categories/routes';
import PromotionsScreen from '~/pages/App/Promotions';
import DeliveriesScreen from '~/pages/App/Deliveries';
import TipsScreen from '~/pages/App/Tips';

import { showTabBar, resetTrigger } from '~/store/modules/user/actions';

import {
  TransparentBackground,
  SearchContainer,
  SearchHeader,
  Searching,
  BarContainer,
} from './styles';

export default function Home() {
  const Tab = createMaterialTopTabNavigator();
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const [progress, setProgress] = useState(0.1);

  useEffect(() => {
    dispatch(showTabBar());
    dispatch(resetTrigger());
  }, []);

  return (
    <>
      <StatusBar backgroundColor="#12b118" barStyle="light-content" />

      <Header
        searching={value => {
          setSearch(value);
          setProgress(0.2);
          setSearching(true);
          setTimeout(() => {
            setProgress(0.4);
          }, 200);
        }}
        result={({ totalResults, results }) => {
          if (totalResults !== 0) {
            setTimeout(() => {
              setProgress(0.6);
            }, 300);
            setTimeout(() => {
              setProgress(0.8);
            }, 600);
            setTimeout(() => {
              setProgress(0.99);
            }, 900);
            setTimeout(() => {
              setSearching(false);
              setProgress(0.99);
              setSearchResults(results);
              setSearchModalVisible(true);
            }, 1100);
          } else {
            setProgress(0.9);
            setTimeout(() => {
              setSearching(false);
            }, 300);
            Toast.show(`Não encontramos nenhum item relacionado à sua busca.`);
          }
        }}
      />

      <Tab.Navigator
        initialRouteName="Produtos"
        tabBarOptions={{
          activeTintColor: '#000',
          inactiveTintColor: '#999',
          style: {
            height: 45,
            justifyContent: 'space-evenly',
          },
          labelStyle: {
            fontSize: 13,
            height: 20,
            width: 75,
            textTransform: 'capitalize',
          },
          indicatorStyle: { backgroundColor: '#12b118', height: 4 },
        }}
      >
        <Tab.Screen name="Produtos" component={CategoriesScreen} />
        <Tab.Screen name="Promoções" component={PromotionsScreen} />
        <Tab.Screen name="Entregas" component={DeliveriesScreen} />
        <Tab.Screen name="Dicas" component={TipsScreen} />
      </Tab.Navigator>

      <Modal
        visible={searching}
        onRequestClose={() => setSearching(false)}
        transparent
      >
        <TransparentBackground>
          <SearchContainer>
            <SearchHeader>
              <Searching>{`Pesquisando por '${search}' aguarde...`}</Searching>
              <BarContainer>
                <ProgressBar
                  progress={progress}
                  color="#12b118"
                  width={300}
                  height={10}
                />
              </BarContainer>
            </SearchHeader>
          </SearchContainer>
        </TransparentBackground>
      </Modal>
      <Search
        open={searchModalVisible}
        closeModal={() => setSearchModalVisible(false)}
        products={searchResults}
        search={search}
      />
    </>
  );
}
