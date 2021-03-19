import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";

import api from "~/services/api";

import ContentItem from "~/components/ContentItem";
import Loader from "~/components/Loader";

import { Container } from "./styles";

//champ

export default function Tips() {
  const [tips, setTips] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(3);
  const [loading, setLoading] = useState(false);

  const loadTips = useCallback(async () => {
    if (page > lastPage) return;
    setLoading(true);

    const {
      data: { data },
    } = await api.get(`blog/contents/categories/5/?page=${page}`);

    setTips([...tips, ...data.data]);
    setPage(page + 1);
    setLastPage(data.last_page);
    setLoading(false);
  }, [page, lastPage, tips]);

  useEffect(() => {
    setPage(1);
    setLastPage(3);
    loadTips();
  }, []);

  return (
    <Container>
      {loading && <Loader />}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={tips}
        numColumns={2}
        style={{ flex: 1, width: "100%" }}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ContentItem item={item} />}
        onEndReached={() => loadTips()}
        onEndReachedThreshold={0.3}
      />
    </Container>
  );
}
