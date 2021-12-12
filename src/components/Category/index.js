import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-tiny-toast";

import api from "~/services/api";
import { addFavorites } from "~/store/modules/cart/actions";

import Header from "~/components/Header";
import Search from "~/components/Search";
import ProductItem from "~/components/ProductItem";
import Loader from "~/components/Loader";

import {
  Container,
  TransparentBackground,
  SearchingContainer,
  SearchingText,
} from "./styles";

//champ

export default function Category({ route }) {
  const signed = useSelector((state) => state.auth.signed);
  const favs = useSelector((state) => state.cart.favorites);

  const dispatch = useDispatch();

  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(3);
  const [loading, setLoading] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const { id } = route.params;

  const loadFavorites = useCallback(async () => {
    const {
      data: { data, meta },
    } = await api.get("clients/wishlists");
    if (meta.message === "Produtos favoritos retornados com sucesso") {
      setFavorites(data);
      dispatch(addFavorites(data));
    } else {
      setFavorites(favs);
    }
  }, []);

  const loadItems = useCallback(async () => {
    if (page > lastPage) return;
    setLoading(true);

    const {
      data: {
        data: { data, last_page },
      },
    } = await api.get(`ecommerce/products/categories/${id}?page=${page}`);

    setItems([...items, ...data]);
    setPage(page + 1);
    setLastPage(last_page);
    setLoading(false);
  }, [page, lastPage, items]);

  useEffect(() => {
    loadItems();
  }, [favorites, favs, signed]);

  useEffect(() => {
    setPage(1);
    setLastPage(3);
    if (signed) loadFavorites();
    loadItems();
  }, []);

  return (
    <>
      <Header
        searching={(value) => {
          setSearch(value);
          setSearching(true);
        }}
        result={({ totalResults, results }) => {
          if (totalResults !== 0) {
            setSearching(false);
            setSearchResults(results);
            setTotal(totalResults);
            setSearchModalVisible(true);
          } else {
            setSearching(false);
            Toast.show(`Não encontramos nenhum item relacionado à sua busca.`);
          }
        }}
      />

      <Container>
        {loading && <Loader />}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={items}
          numColumns={2}
          style={{ flex: 1, width: "100%" }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductItem item={item} />}
          onEndReached={() => loadItems()}
          onEndReachedThreshold={0.3}
        />
      </Container>

      <Modal
        visible={searching}
        onRequestClose={() => setSearching(false)}
        transparent
      >
        <TransparentBackground>
          <SearchingContainer>
            <SearchingText>
              {`Pesquisando por '${search.toUpperCase()}', aguarde...`}
            </SearchingText>
            <ActivityIndicator size="large" color="#777" />
          </SearchingContainer>
        </TransparentBackground>
      </Modal>
      <Search
        open={searchModalVisible}
        closeModal={() => setSearchModalVisible(false)}
        products={searchResults}
        total={total}
        search={search}
      />
    </>
  );
}

Category.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }),
  }).isRequired,
};
