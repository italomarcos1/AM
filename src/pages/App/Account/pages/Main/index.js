import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  StatusBar,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-tiny-toast';
import Icon from 'react-native-vector-icons/Feather';

import {
  ImageContainer,
  Container,
  AvatarContainer,
  Avatar,
  InputContainer,
  Content,
  Item,
  Option,
  OptionsContainer,
  Selected,
  RadioButtonBackground,
  RadioText,
  ChoosePhotoButton,
  VerifiedFieldContainer,
  Field,
  VerifiedField,
  Value,
  TopContainer,
  WelcomeContainer,
  WelcomeTitle,
  CbackValue,
} from './styles';

import Header from '~/components/HeaderMenu';
import Button from '~/components/Button';
import CustomModal from '~/components/CustomModal';
import InputMenu from '~/components/InputMenu';

import { signOut } from '~/store/modules/auth/actions';
import { showTabBar, updateProfileSuccess } from '~/store/modules/user/actions';

import api from '~/services/api';

export default function Main() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.user.profile);
  const signed = useSelector(state => state.auth.signed);
  const triggered = useSelector(state => state.user.triggered);

  const [modalNameVisible, setModalNameVisible] = useState(false);
  const [name, setName] = useState(user.name);
  const [last_name, setLastName] = useState(user.last_name);
  const [modalNameLoading, setModalNameLoading] = useState(false);
  const lastNameRef = useRef();
  const handleEditName = useCallback(async () => {
    if (name !== user.name || last_name !== user.last_name) {
      try {
        setModalNameLoading(true);

        await api.put('clients', { name, last_name });
        const updatedUser = { ...user, name, last_name };

        Toast.showSuccess('Nome atualizado com sucesso.');

        dispatch(updateProfileSuccess(updatedUser));

        setModalNameLoading(false);
        setModalNameVisible(false);
      } catch (err) {
        setModalNameLoading(false);
        Toast.show('Erro ao alterar nome.');
      }
    } else {
      setModalNameVisible(false);
    }
  }, [name, dispatch, last_name]);

  const [modalDocumentVisible, setModalDocumentVisible] = useState(false);
  const [document, setDocument] = useState(user.document);
  const [modalDocumentLoading, setModalDocumentLoading] = useState(false);
  const handleEditDocument = useCallback(async () => {
    if (document !== user.document) {
      try {
        setModalDocumentLoading(true);

        await api.put('clients', { document });
        const updatedUser = { ...user, document };

        Toast.showSuccess('NIF atualizado com sucesso.');

        dispatch(updateProfileSuccess(updatedUser));

        setModalDocumentLoading(false);
        setModalDocumentVisible(false);
      } catch (err) {
        setModalDocumentLoading(false);
        Toast.show('Erro ao alterar NIF.');
      }
    } else {
      setModalDocumentVisible(false);
    }
  }, [document, dispatch]);

  const [modalCellphoneVisible, setModalCellphoneVisible] = useState(false);
  const [cellphone, setCellphone] = useState(user.cellphone);
  const [modalCellphoneLoading, setModalCellphoneLoading] = useState(false);
  const handleEditCellphone = useCallback(async () => {
    if (cellphone !== user.cellphone) {
      try {
        setModalCellphoneLoading(true);

        await api.put('clients', { cellphone });
        const updatedUser = { ...user, cellphone };

        Toast.showSuccess('Telemóvel atualizado com sucesso.');

        dispatch(updateProfileSuccess(updatedUser));

        setModalCellphoneLoading(false);
        setModalCellphoneVisible(false);
      } catch (err) {
        setModalCellphoneLoading(false);
        Toast.show('Erro ao alterar Telemóvel.');
      }
    } else {
      setModalCellphoneVisible(false);
    }
  }, [cellphone, dispatch]);

  const [modalGenderVisible, setModalGenderVisible] = useState(false);
  const [gender, setGender] = useState(user.gender);
  const [modalGenderLoading, setModalGenderLoading] = useState(false);
  const handleEditGender = useCallback(async () => {
    if (gender !== user.gender) {
      try {
        setModalGenderLoading(true);

        await api.put('clients', { gender });
        const updatedUser = { ...user, gender };

        Toast.showSuccess('Gênero atualizado com sucesso.');

        dispatch(updateProfileSuccess(updatedUser));

        setModalGenderLoading(false);
        setModalGenderVisible(false);
      } catch (err) {
        setModalGenderLoading(false);
        Toast.show('Erro ao alterar Gênero.');
      }
    } else {
      setModalGenderVisible(false);
    }
  }, [gender, dispatch]);

  const navigation = useNavigation();

  useEffect(() => {
    if (triggered) {
      navigation.navigate('Orders');
    }
  }, [triggered, navigation]);

  const captureViewRef = useRef();

  const [profilePhoto, setProfilePhoto] = useState(
    user.avatar !== null
      ? user.avatar
      : 'https://api.adorable.io/avatars/90/abott@adorable.png'
  );

  const [uploading, setUploading] = useState(false);

  const handleLogout = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  useEffect(() => {
    dispatch(showTabBar());
  }, []);

  useEffect(() => {
    dispatch(showTabBar());
  }, [signed]);

  async function hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  const handleUploadAvatar = useCallback(async () => {
    try {
      const uri = await captureRef(captureViewRef, {
        format: 'jpg',
        quality: 1,
      });

      if (Platform.OS === 'android')
        if (!(await hasAndroidPermission())) return;

      const upload = new FormData(); // eslint-disable-line

      upload.append('avatar', {
        uri,
        type: 'image/jpeg',
        name: `${user.name}-${Date.now()}.jpeg`,
      });

      const response = await api.post('clients/avatars', upload);

      Toast.showSuccess(response.data.meta.message);
    } catch (error) {
      Toast.show('Erro no atualização da foto de perfil.');
    }

    setUploading(false);
  }, [user.name]);

  const handleChoosePhoto = useCallback(() => {
    const options = {
      title: 'Selecionar imagem',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Tirar foto',
      chooseFromLibraryButtonTitle: 'Selecionar imagem da galeria',
      mediaType: 'photo',
    };

    ImagePicker.showImagePicker(options, image => {
      if (image.didCancel) return;
      if (image.error) Toast.show('Erro ao selecionar a imagem.');
      else {
        setUploading(true);

        const source = {
          uri: `data:image/jpeg;base64,${image.data}`,
        };

        setProfilePhoto(source.uri);

        setTimeout(function () {
          handleUploadAvatar();
        }, 1000);
      }
    });
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#5BAE59" />
      <Header title="Perfil" close={() => navigation.goBack()} />

      <CustomModal
        visible={modalNameVisible}
        modalTitle="Editar Nome"
        loading={modalNameLoading}
        onClosePress={() => {
          setName(user.name);
          setLastName(user.last_name);
          setModalNameVisible(!modalNameVisible);
        }}
        onActionPress={() => {
          handleEditName();
        }}
      >
        <InputContainer>
          <InputMenu
            label="Nome"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={25}
            clear={() => setName('')}
            value={name}
            onChangeText={value => setName(value)}
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
          />
        </InputContainer>

        <InputContainer last={true}>
          <InputMenu
            label="Sobrenome"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={45}
            clear={() => setLastName('')}
            value={last_name}
            ref={lastNameRef}
            onChangeText={value => setLastName(value)}
            returnKeyType="send"
            onSubmitEditing={handleEditName}
          />
        </InputContainer>
      </CustomModal>

      <CustomModal
        visible={modalDocumentVisible}
        modalTitle="Editar NIF"
        loading={modalDocumentLoading}
        onClosePress={() => {
          setDocument(user.document);
          setModalDocumentVisible(!modalDocumentVisible);
        }}
        onActionPress={() => {
          handleEditDocument();
        }}
      >
        <InputContainer last={true}>
          <InputMenu
            label="NIF"
            autoCorrect={false}
            maxLength={45}
            clear={() => setDocument('')}
            value={document}
            onChangeText={value => setDocument(value)}
            returnKeyType="send"
            onSubmitEditing={handleEditDocument}
          />
        </InputContainer>
      </CustomModal>

      <CustomModal
        visible={modalCellphoneVisible}
        modalTitle="Editar Telemóvel"
        loading={modalCellphoneLoading}
        onClosePress={() => {
          setCellphone(user.cellphone);
          setModalCellphoneVisible(!modalCellphoneVisible);
        }}
        onActionPress={() => {
          handleEditCellphone();
        }}
      >
        <InputContainer last={true}>
          <InputMenu
            label="Telemóvel"
            autoCorrect={false}
            maxLength={45}
            clear={() => setCellphone('')}
            value={cellphone}
            onChangeText={value => setCellphone(value)}
            returnKeyType="send"
            onSubmitEditing={handleEditCellphone}
          />
        </InputContainer>
      </CustomModal>

      <CustomModal
        visible={modalGenderVisible}
        modalTitle="Editar Gênero"
        loading={modalGenderLoading}
        onClosePress={() => {
          setGender(user.gender);
          setModalGenderVisible(!modalGenderVisible);
        }}
        onActionPress={() => {
          handleEditGender();
        }}
      >
        <OptionsContainer>
          <Option onPress={() => setGender('Masculino')}>
            <RadioButtonBackground>
              <Selected selected={gender === 'Masculino'} />
            </RadioButtonBackground>
            <RadioText>Masculino</RadioText>
          </Option>

          <Option onPress={() => setGender('Feminino')}>
            <RadioButtonBackground>
              <Selected selected={gender === 'Feminino'} />
            </RadioButtonBackground>
            <RadioText>Feminino</RadioText>
          </Option>

          <Option last={true} onPress={() => setGender('Outro')}>
            <RadioButtonBackground>
              <Selected selected={gender === 'Outro'} />
            </RadioButtonBackground>
            <RadioText>Outro</RadioText>
          </Option>
        </OptionsContainer>
      </CustomModal>

      <Container
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 30,
        }}
      >
        <TopContainer>
          <ImageContainer>
            <AvatarContainer ref={captureViewRef}>
              <Avatar source={{ uri: profilePhoto }} />
            </AvatarContainer>

            <ChoosePhotoButton disabled={uploading} onPress={handleChoosePhoto}>
              {uploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="camera" color="#fff" size={22} />
              )}
            </ChoosePhotoButton>
          </ImageContainer>

          <WelcomeContainer>
            <WelcomeTitle>Olá {user.name},</WelcomeTitle>
            <CbackValue>
              {user.cback_credit > 0.0
                ? `Você possui um crédito de € ${user.cback_credit} para utilizar na próxima encomenda.`
                : `Você não possui créditos, faça sua encomenda para receber novos créditos.`}
            </CbackValue>
          </WelcomeContainer>
        </TopContainer>

        <Content>
          <Item onPress={() => setModalNameVisible(true)}>
            <Field>Nome Completo</Field>
            <Value>
              {user.name} {user.last_name}
            </Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item onPress={() => setModalDocumentVisible(true)}>
            <Field>NIF</Field>
            <Value>{user.document}</Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item onPress={() => setModalCellphoneVisible(true)}>
            <Field>Telemóvel</Field>
            <Value>{user.cellphone}</Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item onPress={() => setModalGenderVisible(true)}>
            <Field>Gênero</Field>
            <Value>{user.gender}</Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item
            disabled={!!user.email_verified}
            onPress={() => navigation.navigate('Mail')}
          >
            <VerifiedFieldContainer>
              <Field>E-mail</Field>
              <VerifiedField verified={!!user.email_verified}>
                {user.email_verified ? 'Verificado' : 'Não-verificado'}
              </VerifiedField>
            </VerifiedFieldContainer>

            <Value>
              {user.email === null
                ? 'Nenhum endereço de e-mail foi cadastrado'
                : user.email}
            </Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item onPress={() => navigation.navigate('Pass')}>
            <Field>Palavra-passe</Field>
            <Value>******</Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item
            onPress={() => navigation.navigate('Shipping')}
            style={{ borderBottomColor: 'transparent', borderBottomWidth: 0 }}
          >
            <Field>Endereços de entrega</Field>
            <Value>
              {user.default_address.length !== 0
                ? `${user.default_address.address}, ${user.default_address.district}`
                : 'Nenhum endereço cadastrado.'}
            </Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Content>
          <Item
            onPress={() => navigation.navigate('Orders')}
            style={{ borderBottomColor: 'transparent', borderBottomWidth: 0 }}
          >
            <Value>Minhas encomendas</Value>
          </Item>
          <Icon name="chevron-right" size={20} color="#A4A4AC" />
        </Content>

        <Button
          style={{
            backgroundColor: '#f53030',
            height: 40,
            maxWidth: 200,
            marginTop: 20,
            borderRadius: 30,
          }}
          textSize={16}
          onPress={handleLogout}
        >
          Sair da conta
        </Button>
      </Container>
    </>
  );
}
