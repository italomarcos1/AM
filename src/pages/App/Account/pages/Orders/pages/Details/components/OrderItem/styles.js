import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

export const Item = styled.View`
  width: 100%;
  border-bottom-width: ${props => props.last ? 0 : '2px'};
  border-color: #eee;
  flex: 1;
  border-radius: 8px;
  padding: 0 0 10px;
  margin-bottom: ${props => props.last ? 0 : '10px'};
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
`;

export const ItemImage = styled.Image`
  width: 110px;
  height: 120px;
  border-radius: 4px;
`;

export const ItemInfo = styled.View`
  flex: 1;
  border-left-color: #efefef;
  border-left-width: 1px;
  margin-left: 15px;
  padding-left: 10px;
  justify-content: space-between;
`;

export const ProductTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  width: 100%;
  color: black;
  text-transform: capitalize;
  align-self: flex-start;
  line-height: 18px;
  padding: 2px;
`;

export const Row = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const Label = styled.Text`
  font-size: 14px;
  color: black;
`;

export const Value = styled.Text`
  margin: 5px 0;
  font-weight: bold;
  font-size: ${props => (props.size ? props.size : '18')}px;
  color: ${props => (props.color ? props.color : '#189000')};
`;
