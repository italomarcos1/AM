import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Toast from 'react-native-tiny-toast';

import api from '~/services/api';

import AddIcon from '~/assets/ico-add-address.svg';
import EditAddressIcon from '~/assets/ico-edit-address.svg';
import RemoveAddressIcon from '~/assets/ico-remove-address.svg';

import Header from '~/components/HeaderMenu';

import {
  Container,
  Address,
  AddressInfo,
  AddressInfoField,
  AddNewAddressButton,
  SideContainer,
  LoadingContainer,
  NoAddressesText,
  NoAddressesContainer,
  RadioButtonBackground,
  Selected,
} from './styles';

import { updateProfileSuccess } from '~/store/modules/user/actions';

export default function Shipping({ navigation }) {
  const user = useSelector(state => state.user.profile);
  const { default_address } = user;

  const dispatch = useDispatch();

  const [selectedAddress, setSelectedAddress] = useState(
    default_address.length !== 0 ? default_address.id : 'none'
  );
  const [selectedAddressId, setSelectedAddressId] = useState(
    default_address.length !== 0 ? default_address.id : -5
  );

  const [loading, setLoading] = useState(false);
  const [noAddresses, setNoAddresses] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const handleDeleteAddress = useCallback(
    async id => {
      try {
        await api.delete(`clients/addresses/${id}`);

        if (user.default_address.id === id)
          dispatch(updateProfileSuccess({ ...user, default_address: [] }));

        if (addresses.length === 1) {
          setAddresses([]);
        } else {
          const filtered = addresses.filter(address => address.id !== id);
          setAddresses(filtered);
        }

        Toast.showSuccess('Endereço removido com sucesso.');
      } catch (err) {
        Toast.show('Erro ao remover o endereço.');
      }
    },
    [addresses, user, dispatch]
  );

  const setDefaultAddress = useCallback(async () => {
    if (
      selectedAddressId === default_address.id ||
      default_address.id === undefined
    )
      return;
    try {
      const {
        data: { data },
      } = await api.put(`/clients/addresses/${selectedAddressId}`, {
        default: 1,
      });

      dispatch(updateProfileSuccess({ ...user, default_address: data }));

      Toast.showSuccess('Endereço atualizado com sucesso.');
    } catch (err) {
      Toast.show('Erro ao atualizar o endereço.');
    }
  }, [selectedAddressId, user, dispatch, default_address]);

  useEffect(() => {
    async function loadAdresses() {
      try {
        setLoading(true);
        const { data } = await api.get('clients/addresses');
        if (data.meta.message !== 'Você ainda não tem endereços cadastrados.') {
          setAddresses(data.data);
          setNoAddresses(false);
        } else {
          setNoAddresses(true);
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }

    loadAdresses();
  }, [user]);

  useEffect(() => {
    setDefaultAddress();
  }, [selectedAddressId, setDefaultAddress]);

  return (
    <>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header
        title="Endereços de entrega"
        custom
        close={() => navigation.goBack()}
      />
      <Container
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        {loading && (
          <LoadingContainer>
            <ActivityIndicator size="large" color="#333" />
          </LoadingContainer>
        )}
        {!loading &&
          !noAddresses &&
          addresses.map(address => (
            <Address
              key={String(address.id)}
              onPress={() => {
                setSelectedAddress(address.id);
                setSelectedAddressId(address.id);
              }}
            >
              <SideContainer>
                <RadioButtonBackground>
                  <Selected selected={selectedAddress === address.id} />
                </RadioButtonBackground>
              </SideContainer>

              <AddressInfo>
                <Text style={{ fontWeight: 'bold' }}>
                  {address.destination_name && `${address.destination_name} `}
                  {address.destination_last_name &&
                    address.destination_last_name}
                </Text>

                <AddressInfoField>
                  {address.address && `${address.address} `}
                  {address.number && address.number}
                </AddressInfoField>

                <AddressInfoField>
                  {address.zipcode && `${address.zipcode} `}
                  {address.city && `${address.city} - `}
                  {address.state && address.state}
                </AddressInfoField>

                {address.complement && (
                  <AddressInfoField>{address.complement}</AddressInfoField>
                )}

                {user.cellphone && (
                  <AddressInfoField>{user.cellphone}</AddressInfoField>
                )}
              </AddressInfo>

              <SideContainer>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(address.id)}
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <RemoveAddressIcon
                    height={20}
                    width={25}
                    style={{ marginBottom: 30 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EditAddress', { address })
                  }
                  hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                >
                  <EditAddressIcon height={20} width={25} />
                </TouchableOpacity>
              </SideContainer>
            </Address>
          ))}
        {!loading && noAddresses && (
          <NoAddressesContainer>
            <NoAddressesText>
              Você ainda não tem endereços cadastrados.
            </NoAddressesText>
          </NoAddressesContainer>
        )}
        <AddNewAddressButton
          onPress={() => navigation.navigate('AddNewAddress')}
        >
          {addresses !== [] ? (
            <AddIcon height={60} width={60} />
          ) : (
            <Text>
              Você ainda não tem endereços adicionados. Clique aqui para
              adicionar.
            </Text>
          )}
        </AddNewAddressButton>
      </Container>
    </>
  );
}

Shipping.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
