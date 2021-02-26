import React from 'react';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

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
} from './styles';

export default function OrderInfo({ transaction }) {
  const navigation = useNavigation();

  return (
    <Item>
      <OrderNumberContainer>
        <ContentContainer>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
            {`Encomenda ${transaction.id}`}
          </Text>
        </ContentContainer>
      </OrderNumberContainer>

      <Order>
        <ContentContainer>
          <Content>Produtos</Content>
          <Content>{`€ ${transaction.total}`}</Content>
        </ContentContainer>

        <ContentContainer>
          <Content>Porte</Content>
          <Content>
            {transaction.shipping > 0
              ? `€ ${transaction.shipping.toFixed(2)}`
              : 'Grátis'}
          </Content>
        </ContentContainer>

        <ContentContainer>
          <Content>Total de encomenda</Content>
          <Content>{`€ ${(transaction.total + transaction.shipping).toFixed(
            2
          )}`}</Content>
        </ContentContainer>
      </Order>

      <ShippingDetails>
        <DeliveryStatus>
          <Content>Estado da Encomenda</Content>
          <ShippingStatus>{transaction.current_status}</ShippingStatus>
        </DeliveryStatus>
      </ShippingDetails>

      <Details
        onPress={() =>
          navigation.navigate('Details', {
            id: transaction.id,
            created: transaction.created,
          })
        }
      >
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Detalhes</Text>
      </Details>
    </Item>
  );
}

OrderInfo.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number,
    current_status: PropTypes.string,
    total: PropTypes.number,
    shipping: PropTypes.number,
    created: PropTypes.string,
  }).isRequired,
};
