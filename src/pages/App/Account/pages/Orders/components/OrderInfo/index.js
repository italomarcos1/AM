import React, { useMemo } from "react";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PropTypes from "prop-types";

import {
  DeliveryStatus,
  Info,
  Item,
  Order,
  OrderNumberContainer,
  ContentContainer,
  Content,
  Details,
  ShippingDetails,
  ShippingStatus,
} from "./styles";

export default function OrderInfo({ transaction }) {
  const navigation = useNavigation();

  const { id, total, statuses, date } = transaction;

  const shipping = useMemo(() => {
    return !!transaction.shipping ? transaction.shipping : 0;
  }, [transaction]);

  return (
    <Item>
      <OrderNumberContainer>
        <ContentContainer>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            {`Encomenda ${id}`}
          </Text>
        </ContentContainer>
      </OrderNumberContainer>

      <Order>
        <ContentContainer>
          <Content>Produtos</Content>
          <Content>{`€ ${total}`}</Content>
        </ContentContainer>

        <ContentContainer>
          <Content>Porte</Content>
          <Content>
            {shipping !== 0 ? `€ ${shipping.toFixed(2)}` : "Grátis"}
          </Content>
        </ContentContainer>

        <ContentContainer>
          <Content>Total de encomenda</Content>
          <Content>{`€ ${(total + shipping).toFixed(2)}`}</Content>
        </ContentContainer>
      </Order>

      <ShippingDetails>
        <DeliveryStatus>
          <Content>Estado da Encomenda</Content>
          <ShippingStatus>{statuses[0].name}</ShippingStatus>
        </DeliveryStatus>
      </ShippingDetails>

      <Details
        onPress={() =>
          navigation.navigate("Details", {
            id,
            created: date,
          })
        }
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Detalhes</Text>
      </Details>
    </Item>
  );
}

OrderInfo.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number || PropTypes.string,
    current_status: PropTypes.string,
    total: PropTypes.number,
    shipping: PropTypes.number,
    created: PropTypes.string,
  }).isRequired,
};
