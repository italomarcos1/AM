import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Keyboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import Toast from 'react-native-tiny-toast';

import Validation from '~/components/Validation';
import ButtonMenu from '~/components/ButtonMenu';
import InputMenu from '~/components/InputMenu';
import Header from '~/components/HeaderMenu';

import api from '~/services/api';
import { updateProfileSuccess } from '~/store/modules/user/actions';
import { Container, InputContainer, InputName, CustomView } from './styles';

export default function EditAddress({ navigation, route }) {
  const user = useSelector(reduxState => reduxState.user.profile);
  const addressInfo = route.params.address;
  const { id } = route.params.address;

  const [destination_name, setDestinationName] = useState(
    addressInfo.destination_name
  );
  const [destination_last_name, setDestinationLastName] = useState(
    addressInfo.destination_last_name
  );
  const [zipcode, setZipcode] = useState(addressInfo.zipcode);
  const [address, setAddress] = useState(addressInfo.address);
  const [number, setNumber] = useState(addressInfo.number);
  const [city, setCity] = useState(addressInfo.city);
  const [state, setState] = useState(addressInfo.state);
  const [district, setDistrict] = useState(addressInfo.district);
  const [complement, setComplement] = useState(addressInfo.complement);

  const destinationLastNameRef = useRef();
  const zipcodeRef = useRef();
  const addressRef = useRef();
  const numberRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const districtRef = useRef();
  const complementRef = useRef();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const postcodeValidation = new RegExp(
    /^[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9]$/
  );
  const postcodeIsValid = postcode => {
    return postcodeValidation.test(postcode);
  };

  const lookupAddress = useCallback(async () => {
    if (!postcodeIsValid(zipcode)) {
      return;
    }
    setLoading(true);

    const [cod, ext] = zipcode.split('-');
    Toast.show('A procurar endereço! Aguarde...');

    try {
      const {
        data: { data },
      } = await api.get(`/postcodes/${cod}-${ext}`);

      setAddress(data.address !== undefined ? data.address : '');
      setDistrict(data.district !== undefined ? data.district : '');
      setCity(data.city !== undefined ? data.city : '');
      setState('Lisboa');

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setAddress('');
      setDistrict('');
      setCity('');
      setState('');
      Toast.show('Informe um código postal válido.');
    }
  }, [zipcode]);

  const handleEditAddress = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.put(`clients/addresses/${id}`, {
        destination_name,
        destination_last_name,
        zipcode,
        address,
        number,
        city,
        state,
        district,
        complement,
        country: 'Portugal',
      });
      dispatch(updateProfileSuccess({ ...user, default_address: data.data }));
      setLoading(false);

      Toast.show(`${data.meta.message}`);
      navigation.goBack();
    } catch (err) {
      setLoading(false);

      Toast.show('Houve um erro ao alterar o endereço.');
    }
  }, [
    id,
    destination_name,
    destination_last_name,
    zipcode,
    address,
    number,
    city,
    state,
    district,
    complement,
    navigation,
    dispatch,
    user,
  ]);

  useEffect(() => {
    lookupAddress();
  }, [zipcode]);

  return (
    <>
      <StatusBar backgroundColor="#5bae59" barStyle="light-content" />

      <Header title="Endereço de entrega" close={() => navigation.goBack()} />
      <Validation title="Altere os dados do seu endereço" />

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
          <CustomView>
            <InputContainer style={{ flex: 1, marginRight: 10 }}>
              <InputName>Nome do destinatário</InputName>
              <InputMenu
                autoFocus
                selected={!!destination_name}
                autoCorrect={false}
                maxLength={25}
                clear={() => setDestinationName('')}
                value={destination_name}
                onChangeText={setDestinationName}
                returnKeyType="next"
                onSubmitEditing={() => destinationLastNameRef.current.focus()}
              />
            </InputContainer>

            <InputContainer style={{ flex: 1, marginRight: 10 }}>
              <InputName>Apelido do destinatário</InputName>
              <InputMenu
                autoFocus
                selected={!!destination_last_name}
                autoCorrect={false}
                maxLength={25}
                clear={() => setDestinationLastName('')}
                value={destination_last_name}
                onChangeText={setDestinationLastName}
                returnKeyType="next"
                onSubmitEditing={() => zipcodeRef.current.focus()}
              />
            </InputContainer>
          </CustomView>

          <CustomView>
            <InputContainer style={{ flex: 1, marginRight: 10 }}>
              <InputName>Código Postal</InputName>
              <InputMenu
                maxLength={8}
                selected={!!zipcode}
                autoCorrect={false}
                keyboardType="phone-pad"
                clear={() => setZipcode('')}
                ref={zipcodeRef}
                value={zipcode}
                onChangeText={setZipcode}
                returnKeyType="next"
                onSubmitEditing={() => numberRef.current.focus()}
              />
            </InputContainer>

            <InputContainer style={{ flex: 1, marginLeft: 10 }}>
              <InputName>Número</InputName>
              <InputMenu
                maxLength={5}
                selected={!!number}
                autoCorrect={false}
                keyboardType="phone-pad"
                clear={() => setNumber('')}
                ref={numberRef}
                value={number}
                onChangeText={setNumber}
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current.focus()}
              />
            </InputContainer>
          </CustomView>

          <InputContainer>
            <InputName>Morada</InputName>
            <InputMenu
              autoCorrect={false}
              maxLength={45}
              selected={!!address}
              clear={() => setAddress('')}
              ref={addressRef}
              value={address}
              onChangeText={setAddress}
              returnKeyType="next"
              onSubmitEditing={() => complementRef.current.focus()}
            />
          </InputContainer>

          <InputContainer>
            <InputName>Complemento</InputName>
            <InputMenu
              autoCorrect={false}
              maxLength={45}
              selected={!!complement}
              clear={() => setComplement('')}
              ref={complementRef}
              value={complement}
              onChangeText={setComplement}
              returnKeyType="next"
              onSubmitEditing={() => districtRef.current.focus()}
            />
          </InputContainer>

          <InputContainer>
            <InputName>Distrito</InputName>
            <InputMenu
              autoCorrect={false}
              maxLength={45}
              selected={!!district}
              clear={() => setDistrict('')}
              ref={districtRef}
              value={district}
              onChangeText={setDistrict}
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current.focus()}
            />
          </InputContainer>

          <CustomView>
            <InputContainer style={{ flex: 1, marginRight: 10 }}>
              <InputName>Cidade</InputName>
              <InputMenu
                maxLength={35}
                selected={!!city}
                clear={() => setCity('')}
                autoCorrect={false}
                ref={cityRef}
                value={city}
                onChangeText={setCity}
                returnKeyType="next"
                onSubmitEditing={() => stateRef.current.focus()}
              />
            </InputContainer>

            <InputContainer style={{ flex: 1, marginLeft: 10 }}>
              <InputName>Localidade</InputName>
              <InputMenu
                maxLength={45}
                selected={!!state}
                autoCorrect={false}
                placeholder="Localidade"
                clear={() => setState('')}
                ref={stateRef}
                value={state}
                onChangeText={setState}
                returnKeyType="send"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </InputContainer>
          </CustomView>

          <ButtonMenu
            loading={loading}
            disabled={
              !zipcode || !address || !number || !city || !state || !district
            }
            onPress={handleEditAddress}
            style={{ marginTop: 40 }}
          >
            Salvar alterações
          </ButtonMenu>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
}

EditAddress.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      address: PropTypes.shape({
        id: PropTypes.number,
        destination_name: PropTypes.string,
        destination_last_name: PropTypes.string,
        zipcode: PropTypes.string,
        address: PropTypes.string,
        number: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        district: PropTypes.string,
        complement: PropTypes.string,
      }),
    }),
  }).isRequired,
};
