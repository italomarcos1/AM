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
  height: 130px;
  width: 100%;
  border-top-right-radius: 9px;
  border-top-left-radius: 9px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

export const InformationContainer = styled.View`
  padding: 10px 10px 15px;
`;

export const Title = styled.Text`
  font-size: 16px;
  text-align: center;
  min-height: 50px;
`;
