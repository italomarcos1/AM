import React, { useCallback, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-tiny-toast';
import PropTypes from 'prop-types';

import Validation from '~/components/Validation';
import ButtonMenu from '~/components/ButtonMenu';
import InputMenu from '~/components/InputMenu';
import Header from '~/components/HeaderMenu';

import api from '~/services/api';

import { Container, InputContainer, InputName } from './styles';

export default function Pass({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(false);
  const { email } = useSelector(state => state.user.profile);

  const newPasswordRef = useRef();

  const confirmNewPasswordRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleChangePassword = useCallback(async () => {
    try {
      setError(false);
      setLoading(true);

      if (newPassword !== confirmNewPassword) {
        throw new Error();
      }

      await api.post('auth/login', {
        email,
        password: oldPassword,
      });

      setLoading(false);

      await api.put('clients/password', {
        password: newPassword,
        password_confirmation: confirmNewPassword,
      });

      Toast.showSuccess('Senha atualizada com sucesso.');
      navigation.goBack();
    } catch (err) {
      setLoading(false);
      setError(true);
      Toast.show(
        'Ocorreu um erro. Confira se as senhas conferem e tente novamente.'
      );
    }
  }, [newPassword, confirmNewPassword, navigation, email, oldPassword]);

  return (
    <>
      <Header title="Alterar senha" close={() => navigation.goBack()} />
      <Validation title="Digite sua nova senha" />

      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        behavior="padding"
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={0}
      >
        <Container
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: 30,
          }}
        >
          <InputContainer style={{ marginTop: 0 }}>
            <InputName>Senha atual</InputName>
            <InputMenu
              secureTextEntry
              autoCorrect={false}
              maxLength={45}
              selected={!!oldPassword}
              clear={() => setOldPassword('')}
              value={oldPassword}
              onChangeText={setOldPassword}
              returnKeyType="next"
              onSubmitEditing={() => newPasswordRef.current.focus()}
            />
          </InputContainer>

          <InputContainer style={{ marginTop: 10 }}>
            <InputName>Nova senha</InputName>
            <InputMenu
              secureTextEntry
              autoCorrect={false}
              maxLength={45}
              selected={!!newPassword}
              clear={() => setNewPassword('')}
              ref={newPasswordRef}
              value={newPassword}
              onChangeText={setNewPassword}
              returnKeyType="next"
              onSubmitEditing={() => confirmNewPasswordRef.current.focus()}
            />
          </InputContainer>

          <InputContainer style={{ marginTop: 10 }}>
            <InputName>Confirmar nova senha</InputName>
            <InputMenu
              secureTextEntry
              autoCorrect={false}
              maxLength={45}
              selected={!!confirmNewPassword}
              clear={() => setConfirmNewPassword('')}
              ref={confirmNewPasswordRef}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              returnKeyType="send"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </InputContainer>

          <ButtonMenu
            loading={loading}
            disabled={
              !oldPassword ||
              newPassword.length < 6 ||
              confirmNewPassword.length < 6
            }
            onPress={handleChangePassword}
            style={{ marginTop: 20 }}
          >
            Alterar senha
          </ButtonMenu>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
}

Pass.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};
