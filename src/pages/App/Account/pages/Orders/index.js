import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  Container,
  NoPurchases,
  NoPurchasesContainer,
  TransactionsList,
} from './styles';

import api from '~/services/api';

import OrderInfo from './components/OrderInfo';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noTransactions, setNoTransactions] = useState(false);

  const navigation = useNavigation();

  const order = useSelector(state => state.user.order);
  const triggered = useSelector(state => state.user.triggered);

  useEffect(() => {
    if (triggered) {
      navigation.navigate('Details', {
        id: order.id,
        created: order.created,
      });
    }
  }, [triggered, order, navigation]);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);

        const { data } = await api.get('clients/transactions');

        if (data.meta.message === 'Não há compras recentes.') {
          setNoTransactions(true);
        } else {
          setTransactions(data.data);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  return (
    <>
      <Container>
        {loading && (
          <NoPurchasesContainer>
            <ActivityIndicator size="large" color="#333" />
          </NoPurchasesContainer>
        )}
        {!loading && !noTransactions && (
          <TransactionsList
            data={transactions}
            keyExtractor={transaction => String(transaction.id)}
            renderItem={({ item: transaction }) => (
              <OrderInfo transaction={transaction} />
            )}
          />
        )}
        {!loading && noTransactions && (
          <NoPurchasesContainer>
            <NoPurchases>Você ainda não efetuou nenhuma compra.</NoPurchases>
          </NoPurchasesContainer>
        )}
      </Container>
    </>
  );
}
