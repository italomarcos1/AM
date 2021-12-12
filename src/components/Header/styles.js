import styled from 'styled-components';

export const Container = styled.View`
  background-color: #12b118;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => (props.isIphoneX ? '50px' : '10px')} 10px 10px;
`;

export const MenuButton = styled.TouchableOpacity`
  margin: 0 10px 0 0;
`;

export const InputContainer = styled.View`
  align-items: center;
  background-color: #fff;
  border-radius: 30px;
  flex-direction: row;
  width: 85%;
  height: 40px;
  padding: 0 10px;
`;

export const Input = styled.TextInput`
  flex: 1;
  color: #999;
  margin-right: 10px;
  font-size: 14px;
  margin-left: 10px;
`;
