import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.View`
  flex: 1;
  padding: 30px 20px 10px;
  border-radius: 8px;
  background-color: #ddd;
  align-items: center;
  justify-content: space-evenly;
`;

export const Title = styled.Text`
  color: #333;
  font-size: 26px;
  margin-top: 10px;
  font-weight: bold;
  text-align: center;
`;

export const Subtitle = styled.Text`
  color: #3d9aca;
  font-size: 16px;
  line-height: 25px;
  margin: 10px 0;
  text-align: center;
`;

export const ViewOrder = styled(Button)`
  border-radius: 30px;
  height: 45px;
  background-color: #12b118;
`;
