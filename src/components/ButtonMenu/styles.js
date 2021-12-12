import styled from 'styled-components/native';

export const CustomButton = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 35px;
  background-color: ${props => (props.disabled ? '#005b06' : '#3b8e39')};
  background-color: #3b8e39;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  color: ${props => (props.disabled ? '#bbb' : '#fff')};
`;
