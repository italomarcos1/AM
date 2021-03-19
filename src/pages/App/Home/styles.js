import styled from 'styled-components/native';

export const SearchHeader = styled.View`
  width: 100%;
  height: 30px;
  align-self: center;
  align-items: center;
  margin: 0 0 15px;
  justify-content: space-between;
  padding: 0 20px 0 10px;
`;

export const ProductItem = styled.TouchableOpacity`
  width: 81.5%;
  height: 160px;
  flex-direction: row;
  padding: 2px 10px;
  background-color: #fff;
  align-items: center;
  border-radius: 4px;
  border-width: 0.75px;
  border-color: #bbb;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const Searching = styled.Text`
  font-size: 18px;
  margin-bottom: 7px;
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
  padding: 5px 5px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: #eee;
  align-items: center;
  justify-content: center;
`;

export const BarContainer = styled.View`
  width: 80%;
  height: 30px;
  align-items: center;
  align-self: center;
`;
