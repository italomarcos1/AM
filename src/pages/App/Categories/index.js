import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useDispatch } from "react-redux";

import api from "~/services/api";
import { showTabBar } from "~/store/modules/user/actions";

import CategoryItem from "~/components/CategoryItem";
import Loader from "~/components/Loader";

import { Container } from "./styles";

//champ

export default function Categories() {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(3);
  const [loading, setLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    if (page > lastPage) return;
    setLoading(true);

    const {
      data: {
        data: { data, last_page },
      },
    } = await api.get(
      `ecommerce/categories/?page=${page}&recursively=1&per_page=13&order_field=slug&order_direction=asc`
    );

    setCategories([...categories, ...data]);
    setPage(page + 1);
    setLastPage(last_page);
    setLoading(false);
  }, [page, lastPage, categories]);

  useEffect(() => {
    dispatch(showTabBar());
    setPage(1);
    setLastPage(3);
    loadCategories();
  }, []);

  return (
    <>
      <Container>
        {loading && <Loader />}

        <FlatList
          showsVerticalScrollIndicator={false}
          data={categories}
          numColumns={2}
          style={{ flex: 1, width: "100%" }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <CategoryItem item={item} />}
          onEndReached={() => loadCategories()}
          onEndReachedThreshold={0.3}
        />
      </Container>
    </>
  );
}
