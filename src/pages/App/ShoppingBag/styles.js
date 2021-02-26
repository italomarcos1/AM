import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #f2f2f2;
  position: relative;
`;

export const ActivityIndicatorContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  background: rgba(0, 0, 0, 0.3);
  align-items: center;
  justify-content: center;
`;

export const FinishButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${props => (props.canContinue ? '#12b118' : '#f00')};
  align-items: center;
  justify-content: center;
  padding: 0 15px;
`;

export const FinishButtonText = styled.Text`
  font-size: 18px;
  letter-spacing: 0.5px;
  color: #fff;
  text-align: center;
  align-self: center;
`;

export const ProductsListContainer = styled.ScrollView`
  flex: 1;
  padding: 0 10px 10px;
`;

export const ProductsList = styled.FlatList`
  flex: 1;
  padding-bottom: 10px;
`;

export const ProductItem = styled.View`
  width: 100%;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  align-items: center;
  border-radius: 6px;
  border-width: 0.75px;
  border-color: #dedede;
  justify-content: space-between;
  margin: 10px 0 0;
`;

export const ProductInfoRow = styled.View`
  flex-direction: row;
  flex: 1;
`;

export const ProductInfoColumn = styled.View`
  flex-direction: column;
  flex: 1;
`;

export const ProductImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-right: 10px;
`;

export const ProductTitle = styled.Text`
  flex: 1;
  color: #333;
  font-size: 18px;
  font-weight: bold;
`;

export const PriceContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-right: 40px;
  align-items: center;
`;

export const OldPrice = styled.Text`
  color: #9f9f9f;
  font-size: 16px;
  font-weight: bold;
  text-decoration: line-through;
`;

export const CurrentPrice = styled.Text`
  color: #333;
  font-size: 16px;
  font-weight: bold;
`;

export const DiscountPercent = styled.Text`
  color: #f06d85;
  font-size: 16px;
  font-weight: bold;
`;

export const ProductBottomRow = styled.View`
  flex: 1;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding-top: 10px;
  margin-top: 10px;
  border-top-width: 1px;
  border-top-color: #ccc;
  align-items: center;
`;

export const QuantityContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const Quantity = styled.Text`
  font-size: 18px;
  font-weight: bold;
  border-width: 1px;
  border-color: #ededed;
  padding: 5px 15px;
  margin: 0 10px;
  min-width: 52px;
  text-align: center;
`;

export const RemoveButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px 5px 0;
  border-right-width: 1px;
  border-right-color: #ccc;
`;

export const RemoveButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-right: 3px;
  margin-top: -2px;
`;

export const Total = styled.Text`
  font-size: 20px;
  font-weight: bold;
  min-width: 80px;
  text-align: right;
`;

export const EmptyBagContainer = styled.View`
  align-self: center;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const EmptyBagTitle = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #3a3a3a;
  margin: 20px 0 10px;
`;

export const EmptyBagText = styled.Text`
  font-size: 16px;
  max-width: 50%;
  text-align: center;
  line-height: 25px;
  font-weight: bold;
  color: #596473;
`;

export const TotalLabel = styled.Text`
  margin-bottom: 10px;
  margin-right: 10px;
  text-align: right;
  font-size: 22px;
  color: #212121;
`;

export const TotalPrice = styled.Text`
  color: #12b118;
`;
