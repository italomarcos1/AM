import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  max-height: 40px;
  flex-direction: row;
  border-bottom-color: #ddd;
  border-bottom-width: 0.25px;
`;

export const CurrentPageButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  justify-content: center;
  padding: 2px 15px 2px 10px;
  flex-direction: row;
`;

export const CurrentPageText = styled.Text`
  color: #999;
  margin-left: 10px;
  flex: 1;
  text-align: center;
`;
