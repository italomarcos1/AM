import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Feather";

import PropTypes from "prop-types";

import api from "~/services/api";
import { addFavorites } from "~/store/modules/cart/actions";
import { showTabBar } from "~/store/modules/user/actions";

import ProductItem from "~/components/ProductItem";
import BreadCrumb from "~/components/BreadCrumb";
import Loader from "~/components/Loader";

import { Container } from "./styles";

Icon.loadFont();

//champ

export default function Products({ route }) {
  const signed = useSelector((state) => state.auth.signed);
  const favs = useSelector((state) => state.cart.favorites);

  const dispatch = useDispatch();

  const { id, name } = route.params;

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(3);
  const [loading, setLoading] = useState(false);

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

  const loadProducts = useCallback(async () => {
    if (page > lastPage) return;
    setLoading(true);

    const {
      data: {
        data: { data, last_page },
      },
    } = await api.get(`ecommerce/products/categories/${id}?page=${page}`);

    setProducts([...products, ...data]);
    setPage(page + 1);
    setLastPage(last_page);
    setLoading(false);
  }, [page, lastPage, products]);

  useEffect(() => {
    loadProducts();
  }, [favorites, favs, signed]);

  useEffect(() => {
    dispatch(showTabBar());
    setPage(1);
    setLastPage(3);
    if (signed) loadFavorites();
    loadProducts();
  }, []);

  return (
    <>
      <BreadCrumb name={name} />
      <Container>
        {loading && <Loader />}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={products}
          numColumns={2}
          style={{ flex: 1, width: "100%" }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductItem item={item} />}
          onEndReached={() => loadProducts()}
          onEndReachedThreshold={0.3}
        />
      </Container>
    </>
  );
}

Products.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  }).isRequired,
};
