import styled from 'styled-components/native';
import LogoBlack from '~/assets/logo-black.svg';

export const Container = styled.ScrollView`
  flex: 1;
  background: #fff;
  position: relative;
`;

export const CloseModal = styled.TouchableOpacity`
  height: 30px;
  width: 30px;
  right: 10px;
  position: absolute;
  top: 50px;
`;

export const Logo = styled(LogoBlack)`
  margin: 10px 0 20px;
  align-self: center;
`;

export const AuthTitle = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #000;
`;

export const RegisterText = styled.Text`
  font-size: 14px;
  color: #444;
`;

export const Form = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const FacebookButton = styled.TouchableOpacity`
  height: 50px;
  width: 80%;
  border-radius: 30px;
  background-color: #3b5998;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ForgotPassword = styled.TouchableOpacity`
  width: 100%;
  align-self: center;
  margin-bottom: 20px;
`;

export const ForgotPasswordText = styled.Text`
  color: #888;
  font-size: 15px;
  text-align: center;
`;
