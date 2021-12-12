import "./config/ReactotronConfig";
import React, { useCallback, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import OneSignal from "react-native-onesignal";

import { Alert, StatusBar, BackHandler, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UUIDGenerator from "react-native-uuid-generator";
import Toast from "react-native-tiny-toast";
import VersionCheck from "react-native-version-check";
import { getAppstoreAppMetadata } from "react-native-appstore-version-checker";
import Routes from "./routes";

import { store, persistor } from "./store";

function Index() {
  const checkVersion = async () => {
    try {
      const updateNeed = await VersionCheck.needUpdate();

      if (updateNeed && updateNeed.isNeeded) {
        Alert.alert(
          "Por favor atualize",
          "Você precisa atualizar o aplicativo para a última versão para continuar comprando.",
          [
            {
              text: "Atualizar",
              onPress: () => {
                BackHandler.exitApp();
                Linking.openURL(updateNeed.storeUrl);
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      Toast.show(error);
    }
  };

  const generateAndStoreUuid = async () => {
    try {
      const uuid = await AsyncStorage.getItem("@uuid");

      if (uuid === null) {
        UUIDGenerator.getRandomUUID(async (uuid) => {
          await AsyncStorage.setItem("@uuid", uuid);
        });
      }
    } catch (error) {
      UUIDGenerator.getRandomUUID(async (uuid) => {
        await AsyncStorage.setItem("@uuid", uuid);
      });
    }
  };

  const onReceived = useCallback(
    (notification) => console.log(notification),
    []
  );

  const onOpened = useCallback((openResult) => console.log(openResult), []);

  const onIds = useCallback((device) => console.log(device), []);

  useEffect(() => {
    checkVersion();

    async function oneSignalCheck() {
      OneSignal.setAppId("e6c7df22-1200-4ab7-bfff-8001bf13a921");

      const deviceState = await OneSignal.getDeviceState();
      if (deviceState.isSubscribed == false) {
        OneSignal.addTrigger("prompt_ios", "true");
      }
    }

    // OneSignal.

    // OneSignal.addEventListener('received', onReceived);
    // OneSignal.addEventListener('opened', onOpened);
    // OneSignal.addEventListener('ids', onIds);
    oneSignalCheck();
    generateAndStoreUuid();

    return () => {
      // OneSignal.removeEventListener('received', this.onReceived);
      // OneSignal.removeEventListener('opened', this.onOpened);
      // OneSignal.removeEventListener('ids', this.onIds);
    };
  }, []);

  const config = {
    screens: {
      Home: "home",
    },
  };

  const linking = {
    enabled: true,
    prefixes: ["amfrutas://", "amfrutas://app", "https://amfrutas.pt"],
    config,
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer linking={linking}>
          <StatusBar barStyle="light-content" backgroundColor="#12b118" />
          <Routes />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default Index;
//comentario aleatorio
