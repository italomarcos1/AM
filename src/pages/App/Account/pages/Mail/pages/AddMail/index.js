import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import Toast from 'react-native-tiny-toast';
import api from '~/services/api';

import Validation from '~/components/Validation';
import InputMenu from '~/components/InputMenu';
import ButtonMenu from '~/components/ButtonMenu';
import Header from '~/components/HeaderMenu';

import { Container, InputContainer, InputName } from './styles';

import { updateProfileSuccess } from '~/store/modules/user/actions';

export default function AddMail() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(state => state.user.profile);

  const navigation = useNavigation();

  const handleAddMail = useCallback(async () => {
    try {
      setLoading(true);

      await api.put('clients', { email });
      const updatedUser = { ...user, email };

      Toast.showSuccess('Email cadastrado com sucesso.');
      setLoading(false);

      dispatch(updateProfileSuccess(updatedUser));
      navigation.navigate('Account');
    } catch (err) {
      setLoading(false);

      Toast.show('Erro ao cadastrar email.');
    }
  }, [email, dispatch, navigation]);

  return (
    <>
      <Header title="Email de acesso" close={() => navigation.goBack()} />

      <Validation title="Informe seu email abaixo" />
      <Container>
        <InputContainer style={{ marginBottom: 0 }}>
          <InputName>Email</InputName>
          <InputMenu
            selected={!!email}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={45}
            clear={() => setEmail('')}
            value={email}
            onChangeText={value => setEmail(value)}
            returnKeyType="send"
            onSubmitEditing={handleAddMail}
          />
        </InputContainer>

        <ButtonMenu
          loading={loading}
          style={{ marginTop: 20 }}
          onPress={handleAddMail}
          disabled={!email}
        >
          Cadastrar email
        </ButtonMenu>
      </Container>
    </>
  );
}

AddMail.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
};
