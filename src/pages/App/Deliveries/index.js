import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";

import api from "~/services/api";

import ContentItem from "~/components/ContentItem";
import Loader from "~/components/Loader";

import { Container } from "./styles";

//champ

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(3);
  const [loading, setLoading] = useState(false);

  const loadDeliveries = useCallback(async () => {
    if (page > lastPage) return;
    setLoading(true);

    const {
      data: { data },
    } = await api.get(`blog/contents/categories/6?page=${page}`);

    setDeliveries([...deliveries, ...data.data]);
    setPage(page + 1);
    setLastPage(data.last_page);
    setLoading(false);
  }, [page, lastPage, deliveries]);

  useEffect(() => {
    setPage(1);
    setLastPage(3);
    loadDeliveries();
  }, []);

  return (
    <Container>
      {loading && <Loader />}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={deliveries}
        numColumns={2}
        style={{ flex: 1, width: "100%" }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ContentItem item={item} />}
        onEndReached={() => loadDeliveries()}
        onEndReachedThreshold={0.3}
      />
    </Container>
  );
}
