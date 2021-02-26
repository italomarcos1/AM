import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  flex-direction: row;
  width: 100%;
  height: 45px;
  padding: 0 20px;
  border-width: 2px;
  border-color: ${({ selected }) => (selected ? '#89D6B9' : 'transparent')};
`;

export const CustomInput = styled.TextInput`
  flex: 1;
  color: #999;
  font-size: 16px;
  font-weight: 100;
  margin-left: 10px;
`;
