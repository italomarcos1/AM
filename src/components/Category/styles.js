import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #f2f2f2;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

export const TransparentBackground = styled.View`
  flex: 1;
  padding: 40px 20px;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
`;

export const SearchingContainer = styled.View`
  height: 120px;
  width: 270px;
  padding: 20px 10px;
  background-color: #ddd;
  align-items: center;
  border-radius: 8px;
  justify-content: space-between;
`;

export const SearchingText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: center;
  margin-bottom: 5px;
`;
