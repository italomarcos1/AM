import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import CategoryItem from "~/components/CategoryItem";
import BreadCrumb from "~/components/BreadCrumb";

import { Container } from "./styles";

export default function ChildrenCategories({ route }) {
  const { items, name } = route.params;

  return (
    <>
      <BreadCrumb name={name} />
      <Container>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={items}
          numColumns={2}
          style={{ flex: 1, width: "100%" }}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CategoryItem
              isCategory={item.all_categories.length !== 0}
              item={item}
            />
          )}
        />
      </Container>
    </>
  );
}

ChildrenCategories.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      items: PropTypes.oneOfType([PropTypes.array]),
      name: PropTypes.string,
    }),
  }).isRequired,
};
