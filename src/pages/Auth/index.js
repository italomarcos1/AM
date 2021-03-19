import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  BackHandler,
  Text,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import Toast from "react-native-tiny-toast";
import { AccessToken, LoginManager } from "react-native-fbsdk";
import appleAuth, {
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import OneSignal from "react-native-onesignal";

import Icon from "react-native-vector-icons/FontAwesome";
import CustomIcon from "react-native-vector-icons/Feather";

import Input from "~/components/Input";
import Button from "~/components/Button";

import Fruits from "~/assets/fruits.jpg";

import {
  Container,
  FacebookButton,
  Logo,
  CloseModal,
  AuthTitle,
  RegisterText,
  Form,
  ForgotPassword,
} from "./styles";

import { signInRequest, signInSuccess } from "~/store/modules/auth/actions";
import { hideTabBar } from "~/store/modules/user/actions";

import api from "~/services/api";

Icon.loadFont();

//champ

export default function Auth() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector((state) => state.auth.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [selected, setSelected] = useState("none");

  const [forgotPasswordModal, setForgotPasswordVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

  const passwordRef = useRef();

  const login = useCallback(() => {
    setSelected("none");
    dispatch(signInRequest(email, password));

    setTimeout(function () {
      navigation.goBack();
    }, 100);
  }, [email, password, dispatch, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Bag");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [navigation])
  );

  const onAppleButtonPress = useCallback(async () => {
    if (appleAuth.isSupported) {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        api
          .post("auth/apple", appleAuthRequestResponse)
          .then((response) => {
            const { token, user } = response.data.data;
            api.defaults.headers.Authorization = `Bearer ${token}`;
            dispatch(signInSuccess(token, user));
            OneSignal.setExternalUserId(String(user.id));

            setTimeout(function () {
              navigation.goBack();
            }, 100);
          })
          .catch(() => {
            Toast.show("Erro ao logar com Apple. Logue com seu e-mail.");
          });
      } else {
        Toast.show("Não foi possível fazer login, utilize seu email e senha.");
      }
    } else {
      Toast.show("Seu dispositivo não tem suporte para esta funcionalidade.");
    }
  }, [dispatch, navigation]);

  useEffect(() => {
    dispatch(hideTabBar());

    if (appleAuth.isSupported) {
      return appleAuth.onCredentialRevoked(() => {});
    }
  }, [dispatch]);

  const handleForgotPassword = useCallback(async () => {
    try {
      setUpdating(true);
      const {
        data: { meta },
      } = await api.post("auth/reset-password", { email: forgotPassword });

      setForgotPasswordVisible(false);
      Toast.show(meta.message);
      setUpdating(false);
    } catch (err) {
      setUpdating(false);

      Toast.show("Não foi possível resetar sua senha.");
      setForgotPasswordVisible(false);
    }
  }, [forgotPassword]);

  const handleFacebookLogin = useCallback(() => {
    setSelected("none");

    LoginManager.logOut();

    LoginManager.logInWithPermissions(["public_profile", "email"])
      .then(() => {
        AccessToken.getCurrentAccessToken().then((data) => {
          const { accessToken, userID } = data;

          api
            .post("auth/facebook", {
              token: accessToken,
              userID,
            })
            .then((response) => {
              const { token, user } = response.data.data;

              api.defaults.headers.Authorization = `Bearer ${token}`;
              dispatch(signInSuccess(token, user));
              OneSignal.setExternalUserId(String(user.id));

              setTimeout(function () {
                navigation.goBack();
              }, 100);
            })
            .catch(() => {
              Toast.show("Erro ao logar com Facebook. Logue com seu e-mail.");
            });
        });
      })
      .catch(() => {
        Toast.show(
          "Não foi possível fazer login com Facebook, por favor entre com seu email"
        );
      });
  }, [dispatch, navigation]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
      }}
      behavior="padding"
      enabled={Platform.OS === "ios"}
      keyboardVerticalOffset={0}
    >
      <Container
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 30,
          paddingTop: 50,
        }}
      >
        <CloseModal onPress={() => navigation.navigate("Home")}>
          <CustomIcon name="x" size={25} color="#000" />
        </CloseModal>

        <Logo />

        <Image source={Fruits} width={150} height={150} />

        <AuthTitle>Bem-vindo</AuthTitle>
        <RegisterText>Registe-se gratuitamente em 15 segundos</RegisterText>

        <Form>
          <Input
            style={{
              height: 55,
              borderRadius: 30,
              marginBottom: 10,
              width: "90%",
              backgroundColor: "#f2f2f2",
            }}
            onFocus={() => setSelected("email")}
            selected={selected === "email"}
            autoCapitalize="none"
            autoCorrect={false}
            icon="user"
            placeholder="Seu email"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <Input
            style={{
              height: 55,
              borderRadius: 30,
              marginBottom: 10,
              width: "90%",
              backgroundColor: "#f2f2f2",
            }}
            onFocus={() => setSelected("password")}
            selected={selected === "password"}
            icon="lock"
            secureTextEntry
            placeholder="Sua senha"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={login}
            value={password}
            onChangeText={setPassword}
          />

          <ForgotPassword
            onPress={() => {
              setForgotPasswordVisible(true);
            }}
          >
            <Text style={{ color: "#888", textAlign: "center" }}>
              Recuperar Senha?
            </Text>
          </ForgotPassword>

          <Button
            style={{
              marginTop: 5,
              marginBottom: 10,
              height: 50,
              borderRadius: 30,
              backgroundColor: "#3b8e39",
            }}
            textSize={20}
            login
            loading={loading}
            onPress={login}
          >
            Entrar ou Registar
          </Button>

          <FacebookButton
            onPress={handleFacebookLogin}
            title="Continue with FB"
            style={{
              backgroundColor: "#3B5998",
            }}
          >
            <Icon name="facebook" color="#fff" size={20} />
            <Text
              style={{
                fontSize: 20,
                lineHeight: 22,
                color: "#fff",
                paddingHorizontal: 10,
              }}
            >
              Entrar com Facebook
            </Text>
          </FacebookButton>

          {Platform.OS === "ios" && Platform.Version >= "13.0" && (
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              buttonType={AppleButton.Type.SIGN_IN}
              cornerRadius={50}
              style={{
                width: "80%",
                height: 52,
                marginTop: 10,
              }}
              onPress={onAppleButtonPress}
            />
          )}
        </Form>
      </Container>

      <Modal
        visible={forgotPasswordModal}
        onRequestClose={setForgotPasswordVisible}
      >
        <Container
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 30,
            paddingTop: 50,
            paddingHorizontal: 20,
          }}
        >
          <CloseModal onPress={() => setForgotPasswordVisible(false)}>
            <CustomIcon name="x" size={25} color="#000" />
          </CloseModal>

          <Logo />

          <Image source={Fruits} />

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#000",
              marginTop: 40,
            }}
          >
            Recuperação de senha
          </Text>

          <Text style={{ fontSize: 14, color: "#444", marginTop: 3 }}>
            Será-lhe enviado um código para recuperar a senha
          </Text>

          <Form>
            <Input
              style={{
                height: 55,
                borderRadius: 30,
                marginBottom: 10,
                marginTop: 20,
                backgroundColor: "#f2f2f2",
              }}
              onFocus={() => setSelected("forgotpassword")}
              selected={selected === "forgotpassword"}
              icon="mail"
              placeholder="Seu email"
              returnKeyType="send"
              onSubmitEditing={handleForgotPassword}
              value={forgotPassword}
              onChangeText={setForgotPassword}
            />

            <Button
              login
              loading={updating}
              disabled={updating}
              onPress={handleForgotPassword}
              textSize={18}
              style={{
                marginTop: 5,
                marginBottom: 20,
                height: 50,
                borderRadius: 30,
                backgroundColor: "#3b8e39",
                width: 250,
              }}
            >
              Recuperar senha
            </Button>
          </Form>
        </Container>
      </Modal>
    </KeyboardAvoidingView>
  );
}
