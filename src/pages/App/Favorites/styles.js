import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

export const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  justify-content: center;
`;

export const AddToCartButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: #12b118;
  align-items: center;
  justify-content: center;
`;

export const AddToCartButtonText = styled.Text`
  font-size: 18px;
  letter-spacing: 0.5px;
  color: #fff;
  text-align: center;
  align-self: center;
`;

export const EmptyListContainer = styled.View`
  align-self: center;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const EmptyListTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #3a3a3a;
  margin: 20px 0 10px;
`;

export const EmptyListText = styled.Text`
  font-size: 16px;
  max-width: 50%;
  text-align: center;
  line-height: 25px;
  font-weight: bold;
  color: #596473;
`;

export const FavoritesList = styled.FlatList`
  flex: 1;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Loading = styled(ActivityIndicator).attrs({
  color: '#777',
  size: 'large',
})``;

export const LoadingText = styled.Text`
  font-size: 20px;
  color: #777;
  margin-top: 20px;
`;
