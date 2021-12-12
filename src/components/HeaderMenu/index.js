import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/Feather";
import PropTypes from "prop-types";
import OneSignal from "react-native-onesignal";
import Toast from "react-native-tiny-toast";

import { Platform, TouchableOpacity, View } from "react-native";

import { Container, Title, CloseHeader } from "./styles";
import { useEffect } from "react";

Icon.loadFont();

export default function Header({ title, close, custom }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [changingSubscription, setChangingSubscription] = useState(false);

  const checkSubscription = useCallback(async () => {
    const {
      isSubscribed: oneSignalIsSubscribed,
    } = await OneSignal.getDeviceState();

    setIsSubscribed(oneSignalIsSubscribed);

    console.log(`check: ${oneSignalIsSubscribed}`);

    return oneSignalIsSubscribed;
  }, []);

  useEffect(() => {
    async function checkSubscriptionOnLoad() {
      await checkSubscription();
    }

    checkSubscriptionOnLoad();
  }, []);

  const handleSubscription = useCallback(async () => {
    setChangingSubscription(true);
    console.log(`isSubscribed: ${isSubscribed}`);

    OneSignal.disablePush(isSubscribed);

    if (!isSubscribed)
      Toast.showSuccess("Você irá receber notificações das encomendas.");
    if (isSubscribed)
      Toast.showSuccess("Você desabilitou notificações de encomendas.");

    setTimeout(async () => {
      await checkSubscription();
    }, 5000);

    setTimeout(() => {
      setChangingSubscription(false);
    }, 10000);
  }, [checkSubscription, isSubscribed]);

  return (
    <Container custom={custom}>
      <View style={{ flexDirection: "row" }}>
        <CloseHeader custom={custom} onPress={close}>
          <Icon
            name="chevron-left"
            color={custom ? "#000" : "#fff"}
            size={28}
          />
        </CloseHeader>
        <Title custom={custom}>{title}</Title>
      </View>
      {Platform.OS !== "ios" && (
        <TouchableOpacity
          disabled={changingSubscription}
          onPress={handleSubscription}
          style={{
            height: 28,
            width: 28,
            marginRight: 5,
          }}
        >
          <Icon
            name={isSubscribed ? "bell" : "bell-off"}
            color={changingSubscription ? "#ccc" : "#fff"}
            size={28}
          />
        </TouchableOpacity>
      )}
    </Container>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  custom: PropTypes.bool,
};

Header.defaultProps = {
  custom: false,
};
