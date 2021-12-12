import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #fff;
  padding: 10px 20px;
`;

export const InputContainer = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 5px 0;
`;

export const InputName = styled.Text`
  font-size: 12px;
  color: #76797e;
  margin-bottom: 5px;
`;

export const CustomView = styled.View`
  flex-direction: row;
  width: 100%;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
