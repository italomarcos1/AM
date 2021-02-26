import styled from 'styled-components/native';

export const ProductsList = styled.FlatList`
  flex: 1;
  width: 100%;
`;

export const Header = styled.View`
  width: 90%;
  height: 30px;
  align-self: center;
  flex-direction: row;
  margin: 0 0 15px;
  justify-content: space-between;
  padding: 0 20px 0 10px;
`;

export const SearchResults = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

export const TransparentBackground = styled.View`
  width: 100%;
  height: 100%;
  padding: 40px 10px 0;
  flex-direction: row;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.6);
`;

export const SearchContainer = styled.View`
  width: 100%;
  height: 75%;
  padding: 35px 5px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #eee;
  align-items: center;
  justify-content: space-around;
`;
