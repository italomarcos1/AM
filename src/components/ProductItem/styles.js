import styled from 'styled-components';

export const Container = styled.TouchableOpacity`
  background: #fff;
  flex-direction: column;
  flex: 1;
  margin: 20px 10px 0;
  border-radius: 9px;
  overflow: hidden;
`;

export const ImageContainer = styled.View`
  position: relative;
`;

export const ItemImage = styled.Image`
  height: 165px;
  width: 100%;
  border-top-right-radius: 9px;
  border-top-left-radius: 9px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

export const ButtonFavorite = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  left: 10px;
  flex: 1;
`;

export const InformationContainer = styled.View`
  padding: 10px 10px 15px;
`;

export const Title = styled.Text`
  font-size: 16px;
  text-align: center;
  min-height: 50px;
`;

export const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const OldPrice = styled.Text`
  color: #999;
  font-size: 16px;
  text-decoration: line-through;
`;

export const OldPriceLabel = styled.Text`
  margin: 0 5px;
  font-weight: bold;
  font-size: 14px;
`;

export const CurrentPrice = styled.Text`
  font-weight: bold;
  font-size: 20px;
`;
