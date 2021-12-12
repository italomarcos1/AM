import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-tiny-toast";
import PropTypes from "prop-types";

import {
  Container,
  AddToCartButton,
  AddToCartButtonText,
  CancelButton,
  CancelButtonText,
  Content,
  Detail,
  DetailStatus,
  DetailField,
  CustomerInfo,
  DetailsContainer,
  ShippingDetailsContainer,
  ShippingAddressContainer,
  ShippingToContainer,
  Separator,
  Value,
  Info,
  Price,
  Small,
} from "./styles";

import api from "~/services/api";
import { addToCartRequest } from "~/store/modules/cart/actions";

import OrderItem from "./components/OrderItem";

export default function Details({ route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.profile);

  const { id, created } = route.params;

  const [transaction, setTransaction] = useState({});
  const [shippingAddress, setShippingAddress] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleAddAllToCart() {
    Object.entries(products).map(([key, product]) => {
      const object = { ...product };

      delete object.qty;
      delete object.unit_price;

      const amount = product.qty;

      dispatch(addToCartRequest(object, amount));
    });

    Toast.showSuccess("Todos os produtos foram\n adicionados ao cesto");
  }

  const handleCancel = useCallback(async (transaction) => {
    try {
      const {
        data: {
          meta: { message },
        },
      } = await api.post(`clients/transactions/statuses/${transaction.id}`);

      Toast.show(message);

      let newTransaction = { ...transaction, status: "Cancelado" };
      setTransaction(newTransaction);
    } catch (err) {
      Toast.show(err);
    }
  }, []);

  useEffect(() => {
    async function loadInfo() {
      try {
        const {
          data: { data },
        } = await api.get(`clients/transactions/${id}`);

        setShippingAddress(data.shippingAddress);
        delete data.shippingAddress;

        setProducts(data.products);

        delete data.products;

        setTransaction(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);

        Toast.show("Houve um erro ao carregar os dados da compra.");
      }
    }
    loadInfo();
  }, []);

  return (
    <>
      <Container
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#333" size="large" />
        ) : (
          <DetailsContainer>
            {products.map((item, index) => (
              <OrderItem
                key={item.id}
                last={products.length === index + 1}
                product={item}
              />
            ))}

            {products.length && (
              <AddToCartButton onPress={() => handleAddAllToCart()}>
                <AddToCartButtonText>Repetir encomenda</AddToCartButtonText>
              </AddToCartButton>
            )}

            <View>
              <Detail>
                <Content>Subtotal</Content>
                <Price>€ {transaction.subtotal.toFixed(2)}</Price>
              </Detail>

              <Detail>
                <Content>Porte</Content>
                <Price>
                  {transaction.shipping > 0
                    ? `€ ${transaction.shipping.toFixed(2)}`
                    : "Grátis"}
                </Price>
              </Detail>

              <Detail>
                <Content>Desconto</Content>
                <Price color="#212121">
                  <Small>
                    {transaction.discount > 0.0 &&
                      transaction.voucher !== null &&
                      ` (${transaction.voucher}) `}
                  </Small>
                  € {transaction.discount.toFixed(2)}
                </Price>
              </Detail>

              <Detail>
                <Content>Crédito Utilizado</Content>
                <Price color="#212121">
                  € {transaction.cback_used.toFixed(2)}
                </Price>
              </Detail>

              <Detail>
                <Content>Total</Content>
                <Price color="#189000">€ {transaction.total}</Price>
              </Detail>
            </View>

            <Info>
              <ShippingToContainer>
                <Content>Meus dados</Content>

                <Text />
              </ShippingToContainer>

              <View>
                <CustomerInfo>
                  <Content>Nome: </Content>
                  <Value>{`${user.name} ${user.last_name}`}</Value>
                </CustomerInfo>

                <CustomerInfo>
                  <Content>Email: </Content>
                  <Value>{user.email}</Value>
                </CustomerInfo>

                <CustomerInfo>
                  <Content>NIF: </Content>
                  <Value>{user.document}</Value>
                </CustomerInfo>

                <CustomerInfo>
                  <Content>Telemóvel: </Content>
                  <Value>{user.cellphone}</Value>
                </CustomerInfo>
              </View>

              <Separator />

              {!!shippingAddress && (
                <ShippingAddressContainer>
                  <Content>{`${shippingAddress.address} ${shippingAddress.district}`}</Content>

                  <Value
                    numberOfLines={2}
                  >{`${shippingAddress.zipcode} ${shippingAddress.city} - ${shippingAddress.state}`}</Value>
                </ShippingAddressContainer>
              )}
            </Info>
            <ShippingDetailsContainer>
              <Detail>
                <DetailField>Crédito Recebido</DetailField>
                <DetailStatus status>
                  € {transaction.cback_received.toFixed(2)}
                </DetailStatus>
              </Detail>

              <Detail>
                <DetailField>Estado da encomenda</DetailField>
                <DetailStatus status={false}>
                  {transaction.status.name}
                </DetailStatus>
              </Detail>

              <Detail>
                <DetailField>Método de pagamento</DetailField>
                <DetailStatus status>{transaction.payment_method}</DetailStatus>
              </Detail>

              <Detail>
                <DetailField>Data da encomenda</DetailField>
                <DetailStatus status>{created}</DetailStatus>
              </Detail>

              <Detail>
                <DetailField>Método de entrega</DetailField>
                <DetailStatus status>
                  {transaction.shipping_method}
                </DetailStatus>
              </Detail>

              {transaction.scheduledShipping !== null && (
                <Detail>
                  <DetailField>Entrega agendada para</DetailField>
                  <DetailStatus status>
                    {transaction.scheduledShipping}
                  </DetailStatus>
                </Detail>
              )}
            </ShippingDetailsContainer>

            {transaction.status.name !== "Cancelado" && (
              <CancelButton onPress={() => handleCancel(transaction)}>
                <CancelButtonText>Cancelar encomenda</CancelButtonText>
              </CancelButton>
            )}
          </DetailsContainer>
        )}
      </Container>
    </>
  );
}

Details.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,

  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
      created: PropTypes.string,
    }),
  }).isRequired,
};
