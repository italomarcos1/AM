import React, { useCallback, useEffect, useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Image,
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/Feather";
import { isIphoneX } from "react-native-iphone-x-helper";
import Toast from "react-native-tiny-toast";

import api from "~/services/api";

import {
  Container,
  Header,
  SubContainer,
  PhoneButton,
  PhoneButtonText,
  Line,
  OptionsContainer,
  OptionsTitle,
  Option,
  OptionText,
} from "./styles";

import PhoneIcon from "~/assets/ico-menu-cellphone.svg";
import Logo from "~/assets/logo-white.svg";
import WhatsAppIcon from "~/assets/ico-menu-whatsapp.svg";
import List from "~/assets/list.gif";

// champ

export default function Menu({ navigation }) {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [whatsappNumber, setWhatsappNumber] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      const [menuData, categoriesData] = await Promise.all([
        api.get("menus/fixed"),
        api.get(
          "ecommerce/categories/?recursively=1&per_page=13&order_field=slug&order_direction=asc"
        ),
      ]);

      const {
        data: {
          data: { phone, whatsapp, links },
        },
      } = menuData;

      const {
        data: {
          data: { data },
        },
      } = categoriesData;

      setPhoneNumber(phone);
      setWhatsappNumber(whatsapp);
      setMenu(links);

      setCategories(data);
      setLoading(false);
    }

    loadMenu();
  }, []);

  const sendWhatsappMessage = useCallback(() => {
    const appUri = `whatsapp://send?phone=${whatsappNumber}`;
    const browserUri = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;
    Linking.canOpenURL(appUri).then((found) => {
      if (found) return Linking.openURL(appUri);

      Toast.show(
        "Não foi possível abrir o aplicativo do whatsapp. Abrindo link no navegador."
      );
      return Linking.openURL(browserUri);
    });
  }, [whatsappNumber]);

  return (
    <>
      <Header isIphoneX={Platform.OS !== "android" && isIphoneX}>
        <SubContainer>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon size={35} name="x" color="#EEE" />
          </TouchableOpacity>
          <Logo />
        </SubContainer>

        <SubContainer>
          <PhoneButton onPress={() => Linking.openURL(`tel:${phoneNumber}`)}>
            <PhoneIcon />
            <PhoneButtonText>Ligar Agora</PhoneButtonText>
          </PhoneButton>

          <PhoneButton onPress={sendWhatsappMessage}>
            <WhatsAppIcon />
            <PhoneButtonText whatsapp>WhatsApp</PhoneButtonText>
          </PhoneButton>
        </SubContainer>
      </Header>

      <Container>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: "#12b118",
            flex: 1,
            paddingBottom: 10,
          }}
        >
          {loading ? (
            <OptionsContainer style={{ padding: 0 }}>
              <OptionsTitle>Produtos</OptionsTitle>
              <Image
                source={List}
                style={{
                  height: 150,
                  width: 350,
                }}
              />
            </OptionsContainer>
          ) : (
            <OptionsContainer>
              <OptionsTitle>Produtos</OptionsTitle>

              {!!categories &&
                categories.map((category) => (
                  <>
                    <Line />

                    <Option
                      key={category.id}
                      onPress={() => {
                        if (category.all_categories.length === 0) {
                          navigation.navigate("Category", {
                            id: category.id,
                          });
                        } else {
                          navigation.navigate("ChildrenCategory", {
                            categories: category.all_categories,
                            categoryName: category.name,
                          });
                        }
                      }}
                    >
                      <OptionText>{category.name}</OptionText>
                      {category.all_categories.length !== 0 ? (
                        <Icon name="plus" color="#000" size={20} />
                      ) : (
                        <Icon />
                      )}
                    </Option>
                  </>
                ))}
            </OptionsContainer>
          )}

          {loading ? (
            <OptionsContainer style={{ padding: 0 }}>
              <OptionsTitle>Atendimento e Social</OptionsTitle>
              <Image
                source={List}
                style={{
                  height: 150,
                  width: 350,
                }}
              />
            </OptionsContainer>
          ) : (
            <OptionsContainer>
              <OptionsTitle>Atendimento e Social</OptionsTitle>
              {!!menu &&
                menu.map(({ name, endpoint, external }) => {
                  return (
                    <>
                      <Line key={name + endpoint} />
                      {!external ? (
                        <Option
                          key={name}
                          onPress={() => {
                            navigation.navigate("Content", {
                              endpoint,
                              title: name,
                            });
                          }}
                        >
                          <OptionText>{name}</OptionText>
                        </Option>
                      ) : (
                        <Option
                          key={name}
                          onPress={() => Linking.openURL(endpoint)}
                        >
                          <OptionText>{name}</OptionText>
                        </Option>
                      )}
                    </>
                  );
                })}
            </OptionsContainer>
          )}
        </ScrollView>
      </Container>
    </>
  );
}

Menu.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
