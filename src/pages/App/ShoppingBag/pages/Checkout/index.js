import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  BackHandler,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  ScrollView,
  View,
} from 'react-native';
import Toast from 'react-native-tiny-toast';

import Header from '~/components/HeaderMenu';
import InputMenu from '~/components/InputMenu';
import CustomModal from '~/components/CustomModal';
import OMButton from '~/components/OpenModalButton';

import { updateProfileSuccess, setOrder } from '~/store/modules/user/actions';

import api from '~/services/api';

import {
  ActivityIndicatorContainer,
  StepsContainer,
  Step,
  StepText,
  Container,
  AlertMessage,
  WarningMessage,
  InputContainer,
  InputName,
  ProceedButton,
  ProceedButtonText,
  Separator,
  Card,
  CardTitle,
  CardRow,
  CardLabel,
  BtnVoucher,
  BtnVoucherText,
  Small,
  OptionsContainer,
  Option,
  Selected,
  RadioButtonBackground,
  RadioText,
} from './styles';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.profile);
  const products = useSelector((state) => state.cart.products);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [alertMessage, setAlertMessage] = useState(
    'Preencha todos os campos para continuar!',
  );
  const [alertMessageVisible, setAlertMessageVisible] = useState(false);

  const [name, setName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [document, setDocument] = useState(null);
  const [cellphone, setCellphone] = useState(null);

  const lastNameRef = useRef();
  const documentRef = useRef();
  const cellphoneRef = useRef();

  const [modalShippingMethodVisible, setModalShippingMethodVisible] = useState(
    false,
  );
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  const [modalDeliveryDateVisible, setModalDeliveryDateVisible] = useState(
    false,
  );
  const [deliveryDates, setDeliveryDates] = useState([]);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(null);

  const [
    modalDeliveryIntervalVisible,
    setModalDeliveryIntervalVisible,
  ] = useState(false);
  const [deliveryIntervals, setDeliveryIntervals] = useState([]);
  const [selectedDeliveryInterval, setSelectedDeliveryInterval] = useState(
    null,
  );

  const [additionalInformation, setAdditionalInformation] = useState(null);

  const [modalAddressVisible, setModalAddressVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('new');

  const [destinationName, setDestinationName] = useState(null);
  const [destinationLastName, setDestinationLastName] = useState(null);
  const [zipcode, setZipcode] = useState(null);
  const [address, setAddress] = useState(null);
  const [number, setNumber] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);

  const destinationNameRef = useRef();
  const destinationLastNameRef = useRef();
  const zipcodeRef = useRef();
  const addressRef = useRef();
  const numberRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const districtRef = useRef();

  const [modalVoucherVisible, setModalVoucherVisible] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [inputVoucher, setInputVoucher] = useState(null);
  const [voucher, setVoucher] = useState(null);

  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [cbackCredit, setCbackCredit] = useState(0);
  const [total, setTotal] = useState(0);

  const postcodeValidation = useMemo(() => {
    return new RegExp(/^[0-9][0-9][0-9][0-9]-[0-9][0-9][0-9]$/);
  }, []);

  const postcodeIsValid = useCallback(
    (postcode) => {
      return postcodeValidation.test(postcode);
    },
    [postcodeValidation],
  );

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
      setDestinationName('');
      setDestinationLastName('');
      setAddress('');
      setDistrict('');
      setCity('');
      setState('');
      Toast.show('Informe um código postal válido.');
    }
  }, [zipcode, postcodeIsValid]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!user || !products.length) {
          navigation.navigate('Bag');
        }
        return true;
      };

      if (!user || !products.length) {
        navigation.navigate('Bag');
      } else {
        setName(user.name !== null && user.name.length ? user.name : '');
        setLastName(
          user.last_name !== null && user.last_name.length
            ? user.last_name
            : '',
        );
        setDocument(
          user.document !== null && user.document.length ? user.document : '',
        );
        setEmail(user.email !== null && user.email.length ? user.email : '');
        setCellphone(
          user.cellphone !== null && user.cellphone.length
            ? user.cellphone
            : '',
        );
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const handleGoToShippingStep = useCallback(async () => {
    if (
      !name.length ||
      !last_name.length ||
      !document.length ||
      !cellphone.length
    ) {
      setAlertMessageVisible(true);
    } else if (
      name !== user.name ||
      last_name !== user.last_name ||
      document !== user.document ||
      cellphone !== user.cellphone
    ) {
      try {
        setAlertMessageVisible(false);
        setLoading(true);

        await api.put('clients', { name, last_name, document, cellphone });
        const updatedUser = { ...user, name, last_name, document, cellphone };

        dispatch(updateProfileSuccess(updatedUser));

        setLoading(false);
        setCurrentStep(2);
      } catch (err) {
        setLoading(false);
        Toast.show('Ocorreu um erro ao processar os dados.');
      }
    } else {
      setAlertMessageVisible(false);
      setCurrentStep(2);
    }
  }, [user, cellphone, dispatch, document, last_name, name]);

  const handleGoToPaymentStep = useCallback(async () => {
    // return;
    if (selectedShippingMethod === null) {
      setAlertMessage('Selecione o método de entrega.');
      setAlertMessageVisible(true);
    } else if (
      selectedShippingMethod.id === 'delivery' &&
      selectedDeliveryInterval === null
    ) {
      setAlertMessage('Selecione o período para entrega.');
      setAlertMessageVisible(true);
    } else if (!zipcode || !address || !city || !district || !number) {
      setAlertMessage('Preencha todos os campos da morada.');
      setAlertMessageVisible(true);
      Toast.show('Preencha todos os campos da morada.');
    } else if (selectedAddress === 'new') {
      try {
        // return;
        setAlertMessageVisible(false);
        setLoading(true);

        const {
          data: { data },
        } = await api.post('clients/addresses', {
          destination_name: destinationName,
          destination_last_name: destinationLastName,
          zipcode,
          address,
          number,
          city,
          state,
          district,
          country: 'Portugal',
        });

        const updatedUser = { ...user, default_address: data };
        dispatch(updateProfileSuccess(updatedUser));

        setLoading(false);
        setSelectedAddress(data);

        setCurrentStep(3);
      } catch (err) {
        setLoading(false);
        Toast.show('Ocorreu um erro ao processar os dados.');
      }
    } else if (
      selectedAddress !== 'new' &&
      (address !== selectedAddress.address ||
        number !== selectedAddress.number ||
        city !== selectedAddress.city ||
        state !== selectedAddress.state ||
        district !== selectedAddress.district)
    ) {
      try {
        setAlertMessageVisible(false);
        setLoading(true);

        const { data } = await api.put(
          `clients/addresses/${selectedAddress.id}`,
          {
            destination_name: destinationName,
            destination_last_name: destinationLastName,
            zipcode,
            address,
            number,
            city,
            state,
            district,
          },
        );

        dispatch(updateProfileSuccess({ ...user, default_address: data }));

        setLoading(false);
        setSelectedAddress(data);
        setCurrentStep(3);
      } catch (err) {
        setLoading(false);
        Toast.show('Ocorreu um erro ao processar os dados.');
      }
    } else {
      setAlertMessageVisible(false);
      setCurrentStep(3);
    }
  }, [
    destinationName,
    destinationLastName,
    address,
    city,
    dispatch,
    district,
    number,
    selectedAddress,
    selectedDeliveryInterval,
    selectedShippingMethod,
    state,
    user,
    zipcode,
  ]);

  const loadCbackCredit = useCallback(async () => {
    const { data } = await api.get('clients/cbacks');

    const updatedUser = { ...user, cback_credit: data.data };
    dispatch(updateProfileSuccess(updatedUser));

    setCbackCredit(data.data);
  }, []);

  const clearAddressForm = useCallback(() => {
    setZipcode(null);
    setAddress(null);
    setNumber(null);
    setDistrict(null);
    setCity(null);
    setState(null);
  }, []);

  const handleConfirmPurchase = useCallback(async () => {
    try {
      Toast.show('Processando sua Encomenda...\nPor favor aguarde.', {
        loading: true,
        position: Toast.position.CENTER,
        duration: 0,
      });

      const {
        data: {
          data: { transaction },
        },
        data: {
          meta: { message },
        },
      } = await api.post('checkout', {
        shipping_address: selectedAddress,
        shippingMethod: selectedShippingMethod.id,
        voucher: voucher !== null ? voucher.voucher : null,
        products: products.map((product) => {
          const { id, qty } = product;

          return {
            id,
            qty,
          };
        }),
        additional_information: additionalInformation,
        deliveryDate:
          selectedShippingMethod.id === 'delivery'
            ? selectedDeliveryDate.id
            : null,
        deliveryInterval:
          selectedShippingMethod.id === 'delivery'
            ? selectedDeliveryInterval.id
            : null,
      });

      dispatch(setOrder({ ...transaction }));

      Toast.hide();

      loadCbackCredit();

      navigation.navigate('PurchaseConfirmation', {
        message,
      });
    } catch (err) {
      Toast.hide();
      Toast.show(err.response.data.meta.message); // texto
    }
  }, [
    additionalInformation,
    loadCbackCredit,
    dispatch,
    navigation,
    products,
    selectedAddress,
    selectedDeliveryDate,
    selectedShippingMethod,
    voucher,
    selectedDeliveryInterval,
  ]);

  const handleApplyVoucher = useCallback(async () => {
    try {
      if (inputVoucher === null || inputVoucher === '') {
        return;
      }

      const {
        data: { data },
      } = await api.get(`vouchers/${inputVoucher}`);

      setModalVoucherVisible(false);
      setVoucher(data);
      setDiscount(Number(subtotal * (data.discount / 100)).toFixed(2));
      Toast.show('Cupom aplicado, aproveite o desconto');
    } catch (err) {
      setVoucher(null);
      setDiscount(0);
      setInputVoucher('');
      Toast.show(
        'Cupom inválido ou sua encomenda não cumpre as regras exigidas.',
      );
    }
  }, [inputVoucher, subtotal]);

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get('clients/addresses');

      if (data.meta.message !== 'Você ainda não tem endereços cadastrados.') {
        setAddresses(data.data);
        setSelectedAddress(data.data[0]);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, []);

  const loadShippingMethods = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `checkout/shipping-methods?subtotal=${subtotal}`,
      );

      setShippingMethods(data.data);
      setSelectedShippingMethod(data.data[0]);

      setLoading(false);
    } catch (err) {
      console.log('error', err.response);

      setLoading(false);
    }
  }, [subtotal]);

  const handleCalculateSubtotal = useCallback(() => {
    setSubtotal(
      products.reduce((totalSum, product) => {
        const { has_promotion, price_promotional, price, qty } = product;

        return totalSum + (has_promotion ? price_promotional : price) * qty;
      }, 0),
    );
  }, [products]);

  const loadShippingCost = useCallback(async () => {
    if (selectedShippingMethod.id === 'withdrawinstore') {
      setShippingCost(0);
    } else {
      try {
        const { data } = await api.get(
          `checkout/shipping-cost?subtotal=${subtotal}`,
        );

        setShippingCost(data.data);
      } catch (err) {
        setLoading(false);
      }
    }
  }, [subtotal, selectedShippingMethod]);

  useEffect(() => {
    if (!user || !products.length) {
      navigation.navigate('Bag');
    }

    if (currentStep === 2) {
      clearAddressForm();
      loadAddresses();
      handleCalculateSubtotal();
      loadShippingMethods();
    }

    if (currentStep === 3) {
      setLoading(true);

      loadShippingCost();
      loadCbackCredit();

      setLoading(false);
    }
  }, [currentStep]);

  useEffect(() => {
    async function loadDeliveryPeriods() {
      try {
        setLoading(true);

        const { data } = await api.get('checkout/delivery-intervals');

        setDeliveryDates(data.data);
        setSelectedDeliveryDate(data.data[0]);
        setDeliveryIntervals(data.data[0].intervals);
        setSelectedDeliveryInterval(data.data[0].intervals[0]);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }

    if (
      selectedShippingMethod !== null &&
      selectedShippingMethod.id === 'delivery'
    ) {
      loadDeliveryPeriods();
    }
  }, [selectedShippingMethod]);

  useEffect(() => {
    if (selectedAddress === 'new') {
      clearAddressForm();
    } else {
      setDestinationName(selectedAddress.destination_name);
      setDestinationLastName(selectedAddress.destination_last_name);
      setZipcode(selectedAddress.zipcode);
      setAddress(selectedAddress.address);
      setNumber(selectedAddress.number);
      setDistrict(selectedAddress.district);
      setCity(selectedAddress.city);
      setState(selectedAddress.state);
    }
  }, [selectedAddress, clearAddressForm]);

  useEffect(() => {
    function handleCalculateTotal() {
      setTotal(
        Number(
          Number(subtotal) +
            Number(shippingCost) -
            (Number(discount) + Number(cbackCredit)),
        ).toFixed(2),
      );
    }

    if (currentStep === 3) {
      handleCalculateTotal();
    }
  }, [subtotal, shippingCost, discount, currentStep, cbackCredit]);

  useEffect(() => {
    lookupAddress();
  }, [zipcode]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Header
        title="Confirmar encomenda"
        close={() => navigation.goBack()}
        custom={true}
      />

      <StepsContainer>
        <Step
          validated={currentStep > 1}
          selected={currentStep === 1}
          disabled={currentStep < 1}
          onPress={() => {
            if (currentStep > 1) {
              setCurrentStep(1);
            }
          }}>
          <StepText>Meus dados</StepText>
        </Step>

        <Step
          validated={currentStep > 2}
          selected={currentStep === 2}
          disabled={currentStep < 2}
          onPress={() => {
            if (currentStep > 2) {
              setCurrentStep(2);
            }
          }}>
          <StepText>Entrega</StepText>
        </Step>

        <Step
          validated={currentStep > 3}
          selected={currentStep === 3}
          disabled={currentStep < 3}>
          <StepText>Pagamento</StepText>
        </Step>
      </StepsContainer>

      <KeyboardAvoidingView
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        behavior="padding"
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={0}>
        <Container>
          {loading && (
            <ActivityIndicatorContainer>
              <ActivityIndicator size="large" color="#12b118" />
            </ActivityIndicatorContainer>
          )}

          <ScrollView>
            <AlertMessage visible={alertMessageVisible}>
              {alertMessage}
            </AlertMessage>

            {currentStep === 1 && (
              <>
                <InputContainer>
                  <InputMenu
                    label="Nome"
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={25}
                    clear={() => setName('')}
                    value={name}
                    onChangeText={(value) => setName(value)}
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current.focus()}
                  />
                </InputContainer>

                <InputContainer>
                  <InputMenu
                    label="Sobrenome"
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={45}
                    clear={() => setLastName('')}
                    value={last_name}
                    ref={lastNameRef}
                    onChangeText={(value) => setLastName(value)}
                    returnKeyType="next"
                    onSubmitEditing={() => documentRef.current.focus()}
                  />
                </InputContainer>

                <InputContainer>
                  <InputMenu
                    label="NIF"
                    autoCorrect={false}
                    maxLength={45}
                    clear={() => setDocument('')}
                    value={document}
                    ref={documentRef}
                    onChangeText={(value) => setDocument(value)}
                    returnKeyType="next"
                    onSubmitEditing={() => cellphoneRef.current.focus()}
                  />
                </InputContainer>

                <InputContainer>
                  <InputMenu
                    label="Telemóvel"
                    autoCorrect={false}
                    maxLength={45}
                    clear={() => setCellphone('')}
                    value={cellphone}
                    ref={cellphoneRef}
                    onChangeText={(value) => setCellphone(value)}
                    returnKeyType="send"
                    onSubmitEditing={handleGoToShippingStep}
                  />
                </InputContainer>

                <ProceedButton onPress={handleGoToShippingStep}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ProceedButtonText>Continuar</ProceedButtonText>
                  )}
                </ProceedButton>
              </>
            )}

            {currentStep === 2 && (
              <>
                {!!shippingMethods.length && (
                  <>
                    <OMButton
                      label="Método de entrega"
                      text={
                        selectedShippingMethod !== null
                          ? `${selectedShippingMethod.label} - ${
                              selectedShippingMethod.cost === 0
                                ? 'Grátis'
                                : `€ ${Number(
                                    selectedShippingMethod.cost,
                                  ).toFixed(2)}`
                            }`
                          : 'Selecione para continuar'
                      }
                      onPress={() => {
                        setModalShippingMethodVisible(true);
                      }}
                    />

                    <CustomModal
                      visible={modalShippingMethodVisible}
                      modalTitle="Selecione o método de entrega"
                      loading={loading}
                      hideCloseButton
                      onClosePress={() => {
                        setModalShippingMethodVisible(false);
                      }}
                      actionText="Confirmar"
                      onActionPress={() => {
                        setModalShippingMethodVisible(false);
                      }}>
                      <OptionsContainer>
                        {shippingMethods.map((item, index) => (
                          <Option
                            last={shippingMethods.length === index + 1}
                            key={item.id}
                            onPress={() => {
                              setSelectedShippingMethod(item);
                            }}>
                            <RadioButtonBackground>
                              <Selected
                                selected={selectedShippingMethod === item}
                              />
                            </RadioButtonBackground>

                            <RadioText>{`${item.label} - ${
                              item.cost === 0
                                ? 'Grátis'
                                : `€ ${Number(item.cost).toFixed(2)}`
                            }`}</RadioText>
                          </Option>
                        ))}
                      </OptionsContainer>
                    </CustomModal>
                  </>
                )}

                <WarningMessage
                  visible={
                    selectedShippingMethod !== null &&
                    selectedShippingMethod.id === 'withdrawinstore'
                  }>
                  A retirada na loja deve ocorrer no endereço abaixo: Av. da
                  República 1058 2775-271 Parede
                </WarningMessage>

                {selectedShippingMethod !== null &&
                  selectedShippingMethod.id === 'delivery' &&
                  deliveryDates.length > 0 && (
                    <>
                      <OMButton
                        label="Data da entrega"
                        text={
                          selectedDeliveryDate !== null
                            ? selectedDeliveryDate.label
                            : 'Selecione para continuar'
                        }
                        onPress={() => {
                          setModalDeliveryDateVisible(true);
                        }}
                      />

                      <CustomModal
                        visible={modalDeliveryDateVisible}
                        modalTitle="Selecione a melhor data"
                        loading={loading}
                        hideCloseButton
                        onClosePress={() => {
                          setModalDeliveryDateVisible(false);
                        }}
                        actionText="Confirmar"
                        onActionPress={() => {
                          setModalDeliveryDateVisible(false);
                        }}>
                        <OptionsContainer>
                          {deliveryDates.map((item, index) => (
                            <Option
                              last={deliveryDates.length === index + 1}
                              key={item.id}
                              onPress={() => {
                                setSelectedDeliveryDate(item);
                                setDeliveryIntervals(item.intervals);
                              }}>
                              <RadioButtonBackground>
                                <Selected
                                  selected={selectedDeliveryDate === item}
                                />
                              </RadioButtonBackground>

                              <RadioText>{item.label}</RadioText>
                            </Option>
                          ))}
                        </OptionsContainer>
                      </CustomModal>
                    </>
                  )}

                {selectedShippingMethod !== null &&
                  selectedShippingMethod.id === 'delivery' &&
                  selectedDeliveryDate !== null &&
                  deliveryIntervals.length > 0 && (
                    <>
                      <OMButton
                        label="Horário da entrega"
                        text={
                          selectedDeliveryInterval !== null
                            ? selectedDeliveryInterval.label
                            : 'Selecione para continuar'
                        }
                        onPress={() => {
                          setModalDeliveryIntervalVisible(true);
                        }}
                      />

                      <CustomModal
                        visible={modalDeliveryIntervalVisible}
                        modalTitle="Selecione o melhor horário"
                        loading={loading}
                        hideCloseButton
                        onClosePress={() => {
                          setModalDeliveryIntervalVisible(false);
                        }}
                        actionText="Confirmar"
                        onActionPress={() => {
                          setModalDeliveryIntervalVisible(false);
                        }}>
                        <OptionsContainer>
                          {deliveryIntervals.map((item, index) => (
                            <Option
                              last={deliveryIntervals.length === index + 1}
                              key={item.id}
                              onPress={() => {
                                setSelectedDeliveryInterval(item);
                              }}>
                              <RadioButtonBackground>
                                <Selected
                                  selected={selectedDeliveryInterval === item}
                                />
                              </RadioButtonBackground>

                              <RadioText>{item.label}</RadioText>
                            </Option>
                          ))}
                        </OptionsContainer>
                      </CustomModal>
                    </>
                  )}

                <Separator />

                {!loading && addresses.length > 0 && (
                  <>
                    <OMButton
                      label="Morada para entrega"
                      text={
                        selectedAddress !== 'new'
                          ? `${selectedAddress.address} ${selectedAddress.number} - ${selectedAddress.zipcode} ${selectedAddress.city} - ${selectedAddress.state}`
                          : 'Nova Morada'
                      }
                      onPress={() => {
                        setModalAddressVisible(true);
                      }}
                    />

                    <CustomModal
                      visible={modalAddressVisible}
                      modalTitle="Selecione a morada"
                      loading={loading}
                      hideCloseButton
                      onClosePress={() => {
                        setModalAddressVisible(false);
                      }}
                      actionText="Confirmar"
                      onActionPress={() => {
                        setModalAddressVisible(false);
                      }}>
                      <OptionsContainer>
                        <Option
                          onPress={() => {
                            setSelectedAddress('new');
                          }}>
                          <RadioButtonBackground>
                            <Selected selected={selectedAddress === 'new'} />
                          </RadioButtonBackground>

                          <RadioText>Nova Morada</RadioText>
                        </Option>

                        {addresses.map((item, index) => (
                          <Option
                            last={addresses.length === index + 1}
                            key={item.id}
                            onPress={() => {
                              setSelectedAddress(item);
                            }}>
                            <RadioButtonBackground>
                              <Selected selected={selectedAddress === item} />
                            </RadioButtonBackground>

                            <RadioText>{`${item.address} ${item.number} - ${item.zipcode} ${item.city} - ${item.state}`}</RadioText>
                          </Option>
                        ))}
                      </OptionsContainer>
                    </CustomModal>
                  </>
                )}

                <View>
                  <InputContainer>
                    <InputMenu
                      label="Nome do destinatário"
                      maxLength={25}
                      autoCorrect={false}
                      clear={() => setDestinationName('')}
                      ref={destinationNameRef}
                      value={destinationName}
                      onChangeText={setDestinationName}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        destinationLastNameRef.current.focus()
                      }
                    />
                  </InputContainer>

                  <InputContainer>
                    <InputMenu
                      label="Apelido do destinatário"
                      maxLength={25}
                      autoCorrect={false}
                      clear={() => setDestinationLastName('')}
                      ref={destinationLastNameRef}
                      value={destinationLastName}
                      onChangeText={setDestinationLastName}
                      returnKeyType="next"
                      onSubmitEditing={() => zipcodeRef.current.focus()}
                    />
                  </InputContainer>

                  <InputContainer>
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

                  <InputContainer>
                    <InputMenu
                      label="Número/Andar"
                      maxLength={5}
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

                  <InputContainer>
                    <InputMenu
                      label="Morada"
                      autoCorrect={false}
                      maxLength={45}
                      clear={() => setAddress('')}
                      ref={addressRef}
                      value={address}
                      onChangeText={setAddress}
                      returnKeyType="next"
                      onSubmitEditing={() => districtRef.current.focus()}
                    />
                  </InputContainer>

                  <InputContainer>
                    <InputMenu
                      label="Distrito"
                      autoCorrect={false}
                      maxLength={45}
                      clear={() => setDistrict('')}
                      ref={districtRef}
                      value={district}
                      onChangeText={setDistrict}
                      returnKeyType="next"
                      onSubmitEditing={() => cityRef.current.focus()}
                    />
                  </InputContainer>

                  <InputContainer>
                    <InputMenu
                      label="Cidade"
                      maxLength={35}
                      clear={() => setCity('')}
                      autoCorrect={false}
                      ref={cityRef}
                      value={city}
                      onChangeText={setCity}
                      returnKeyType="next"
                      onSubmitEditing={() => stateRef.current.focus()}
                    />
                  </InputContainer>

                  <InputContainer>
                    <InputMenu
                      label="Localidade"
                      maxLength={45}
                      autoCorrect={false}
                      clear={() => setState('')}
                      ref={stateRef}
                      value={state}
                      onChangeText={setState}
                      returnKeyType="send"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                  </InputContainer>
                </View>

                <ProceedButton onPress={handleGoToPaymentStep}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ProceedButtonText>Continuar</ProceedButtonText>
                  )}
                </ProceedButton>
              </>
            )}

            {currentStep === 3 && (
              <>
                <Card>
                  <CardTitle>Produtos</CardTitle>

                  <CardRow>
                    <CardLabel bold width={70}>
                      Item
                    </CardLabel>
                    <CardLabel bold align="center" width={10}>
                      Qtd
                    </CardLabel>
                    <CardLabel bold align="right" width={20}>
                      Subtotal
                    </CardLabel>
                  </CardRow>

                  {products.map((item) => (
                    <CardRow key={item.id}>
                      <CardLabel width={72}>
                        {item.title} <Small>(€{item.price})</Small>
                      </CardLabel>
                      <CardLabel width={8} align="center">
                        {item.qty}
                      </CardLabel>
                      <CardLabel width={20} align="right">
                        € {Number(item.qty * item.price).toFixed(2)}
                      </CardLabel>
                    </CardRow>
                  ))}
                </Card>

                <Card>
                  <CardTitle>Meus dados</CardTitle>

                  <CardRow>
                    <CardLabel>
                      Nome: {name} {last_name}
                    </CardLabel>
                  </CardRow>

                  <CardRow>
                    <CardLabel>Email: {email}</CardLabel>
                  </CardRow>

                  <CardRow>
                    <CardLabel>NIF: {document}</CardLabel>
                  </CardRow>

                  <CardRow>
                    <CardLabel>Telemóvel: {cellphone}</CardLabel>
                  </CardRow>
                </Card>

                <Card>
                  <CardRow noMargin>
                    <CardLabel>Entrega:</CardLabel>
                    <CardLabel>{selectedShippingMethod.label}</CardLabel>
                  </CardRow>

                  {selectedShippingMethod.id === 'delivery' && (
                    <CardRow>
                      <CardLabel>Agendado para:</CardLabel>
                      <CardLabel>{`${selectedDeliveryDate.label} ${selectedDeliveryInterval.label}`}</CardLabel>
                    </CardRow>
                  )}
                </Card>

                <Card>
                  <CardTitle>Resumo do Pedido</CardTitle>

                  <CardRow>
                    <CardLabel>Subtotal:</CardLabel>
                    <CardLabel>€ {Number(subtotal).toFixed(2)}</CardLabel>
                  </CardRow>

                  <CardRow>
                    <CardLabel>Porte:</CardLabel>
                    <CardLabel>
                      {shippingCost > 0
                        ? `€ ${Number(shippingCost).toFixed(2)}`
                        : 'Grátis'}
                    </CardLabel>
                  </CardRow>

                  <CardRow>
                    <CardLabel>Crédito disponível:</CardLabel>
                    <CardLabel>€ {Number(cbackCredit).toFixed(2)}</CardLabel>
                  </CardRow>

                  <CardRow>
                    <CardLabel>Desconto:</CardLabel>

                    {voucher !== null ? (
                      <>
                        <BtnVoucher
                          onPress={() => {
                            setInputVoucher(null);
                            setVoucher(null);
                            setDiscount(0);
                          }}>
                          <BtnVoucherText>
                            Remover Cupom € {Number(discount).toFixed(2)}
                          </BtnVoucherText>
                        </BtnVoucher>
                      </>
                    ) : (
                      <>
                        <BtnVoucher
                          onPress={() => {
                            setModalVoucherVisible(true);
                          }}>
                          <BtnVoucherText>Adicionar Cupom</BtnVoucherText>
                        </BtnVoucher>

                        <CustomModal
                          visible={modalVoucherVisible}
                          modalTitle="Digite o cupom abaixo"
                          loading={loading}
                          onClosePress={() => {
                            setModalVoucherVisible(false);
                          }}
                          actionText="Confirmar"
                          onActionPress={handleApplyVoucher}>
                          <InputContainer>
                            <InputMenu
                              label="Cupom"
                              autoCorrect={false}
                              maxLength={45}
                              clear={() => setInputVoucher('')}
                              value={inputVoucher}
                              onChangeText={(value) => setInputVoucher(value)}
                              onSubmitEditing={handleApplyVoucher}
                            />
                          </InputContainer>
                        </CustomModal>
                      </>
                    )}
                  </CardRow>

                  <CardRow>
                    <CardLabel>Total:</CardLabel>
                    <CardLabel>€ {Number(total).toFixed(2)}</CardLabel>
                  </CardRow>
                </Card>

                <Card>
                  <InputMenu
                    label="Se não encontrou o que procura, digite abaixo que iremos verificar para si."
                    autoCapitalize="words"
                    autoCorrect={false}
                    multiline={true}
                    numberOfLines={4}
                    clear={() => setAdditionalInformation('')}
                    value={additionalInformation}
                    onChangeText={(value) => setAdditionalInformation(value)}
                    returnKeyType="send"
                    onSubmitEditing={handleConfirmPurchase}
                  />
                </Card>

                <ProceedButton onPress={handleConfirmPurchase}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ProceedButtonText>Confirmar encomenda</ProceedButtonText>
                  )}
                </ProceedButton>
              </>
            )}
          </ScrollView>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
}
