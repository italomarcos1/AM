import React from 'react';
import { StatusBar, Modal, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

import ProductItem from '~/components/ProductItem';

import {
  ProductsList,
  Header,
  SearchContainer,
  TransparentBackground,
  SearchResults,
} from './styles';

Icon.loadFont();

export default function Search({ open, closeModal, products, search }) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#12b118" />

      <Modal visible={open} transparent onRequestClose={closeModal}>
        <TransparentBackground>
          <SearchContainer>
            <Header>
              <View>
                <SearchResults>{`Resultados da Pesquisa: "${search}"`}</SearchResults>
              </View>

              <TouchableOpacity onPress={closeModal} style={{ height: 30 }}>
                <Icon name="x" size={30} color="#aaa" />
              </TouchableOpacity>
            </Header>
            <ProductsList
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={products}
              keyExtractor={product => String(product.id)}
              renderItem={({ item }) => (
                <ProductItem item={item} closeModal={closeModal} />
              )}
            />
          </SearchContainer>
        </TransparentBackground>
      </Modal>
    </>
  );
}

Search.propTypes = {
  open: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  products: PropTypes.oneOfType([PropTypes.array]).isRequired,
};
