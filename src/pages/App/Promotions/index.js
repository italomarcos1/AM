import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import api from "~/services/api";
import { addFavorites } from "~/store/modules/cart/actions";

import ProductItem from "~/components/ProductItem";
import Loader from "~/components/Loader";

import { Container } from "./styles";

//champ

export default function Promotions() {
  const signed = useSelector((state) => state.auth.signed);
  const favs = useSelector((state) => state.cart.favorites);

  const dispatch = useDispatch();

  const [promotions, setPromotions] = useState([]);
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

  const loadPromotions = useCallback(async () => {
    if (page > lastPage) return;
    setLoading(true);

    const {
      data: {
        data: { data, last_page },
      },
    } = await api.get(`ecommerce/products?page=${page}&only_promotional=1`);

    setPromotions([...promotions, ...data]);
    setPage(page + 1);
    setLastPage(last_page);
    setLoading(false);
  }, [page, lastPage, promotions]);

  useEffect(() => {
    loadPromotions();
  }, [favorites, favs, signed]);

  useEffect(() => {
    setPage(1);
    setLastPage(3);
    if (signed) loadFavorites();
    loadPromotions();
  }, []);

  return (
    <Container>
      {loading && <Loader />}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={promotions}
        numColumns={2}
        style={{ flex: 1, width: "100%" }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductItem item={item} />}
        onEndReached={() => loadPromotions()}
        onEndReachedThreshold={0.3}
      />
    </Container>
  );
}
