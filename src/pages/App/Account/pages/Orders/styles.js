import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f2f3f4;
  padding: 10px 10px 0;
`;

export const NoPurchasesContainer = styled.View`
  flex: 1;
  align-self: center;
  justify-content: center;
`;

export const NoPurchases = styled.Text`
  font-size: 20px;
  color: #333;
  align-self: center;
  text-align: center;
`;

export const TransactionsList = styled.FlatList`
  flex: 1;
  background-color: #f2f3f4;
`;
