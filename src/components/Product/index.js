import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomIcon from "react-native-vector-icons/Feather";
import Toast from "react-native-tiny-toast";
import { Text, View, ScrollView, Linking, Modal, Platform } from "react-native";
import HTML from "react-native-render-html";
import { isIphoneX } from "react-native-iphone-x-helper";

import PropTypes from "prop-types";
import {
  AmountButton,
  AmountButtonContainer,
  Amount,
  BackButton,
  PriceContainer,
  OldPrice,
  OldPriceLabel,
  Price,
  SeeDescription,
  DescriptionButtonContainer,
  ProductImage,
  ProductInfo,
  ProductPrice,
  ProductNameContainer,
  FavoriteContainer,
  ShippingContainer,
  Shipping,
  ShippingPrice,
  ShippingDestination,
  Promotional,
  PromotionalPrice,
  PromotionalContainer,
  AddToCartContainer,
  WhatsAppButton,
  AddToCartButton,
  CreditContainer,
  MinimalPrice,
  WarrantyContainer,
  ShieldContainer,
  TransparentBackground,
  DescriptionContainer,
  DescriptionHeader,
  DescriptionHeaderText,
  CloseDescription,
  OffArea,
} from "./styles";

import WhatsAppIcon from "~/assets/ico-menu-whatsapp.svg";
import Shield from "~/assets/ico-shield.svg";

import {
  addToCartRequest,
  addToFavoritesRequest,
  removeFromFavoritesRequest,
} from "~/store/modules/cart/actions";

import api from "~/services/api";

Icon.loadFont();
CustomIcon.loadFont();

//champ

export default function Product({ route, navigation }) {
  const product = route.params.item;

  const signed = useSelector((state) => state.auth.signed);
  const favorites = useSelector((state) => state.cart.favorites);
  const updating = useSelector((state) => state.cart.updating);
  const products = useSelector((state) => state.cart.products);

  const [favorite, setFavorite] = useState(false);

  const [shippingCost, setShippingCost] = useState("");
  const [freeShippingMessage, setFreeShippingMessage] = useState("");
  const [shippingDeadline, setShippingDeadline] = useState("");
  const [minValueShipping, setMinValueShipping] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const [whatsappNumber, setWhatsappNumber] = useState([]);

  const [openDescription, setDescriptionOpen] = useState(false);

  useEffect(() => {
    async function loadProductImages() {
      const [prod, menuData] = await Promise.all([
        api.get(`ecommerce/products/${product.id}`),
        api.get("configurations?keys=whatsapp"),
      ]);

      const {
        shipping_cost,
        free_shipping_message,
        shipping_deadline,
        min_value_shipping,
        description,
      } = prod.data.data;

      const { whatsapp } = menuData.data;

      setShippingCost(shipping_cost);
      setFreeShippingMessage(free_shipping_message);
      setShippingDeadline(shipping_deadline);
      setMinValueShipping(min_value_shipping);

      setProductDescription(description);

      setWhatsappNumber(whatsapp);
    }
    loadProductImages();
  }, []);

  const [amount, setAmount] = useState(() => {
    const index = products.findIndex((prod) => prod.id === product.id);
    return index >= 0 ? products[index].qty : 1;
  });

  const dispatch = useDispatch();

  const sendWhatsappMessage = useCallback(() => {
    const appUri = `whatsapp://send?phone=${whatsappNumber}`;
    const browserUri = `https://api.whatsapp.com/send?phone=${whatsappNumber}`;
    Linking.canOpenURL(appUri).then((found) => {
      if (found) {
        return Linking.openURL(appUri);
      }

      return Linking.openURL(browserUri);
    });
  }, [whatsappNumber]);

  const handleAddToCart = useCallback(() => {
    dispatch(addToCartRequest(product, amount));
  }, [dispatch, product, amount]);

  const handlePromotionalPercentage = useCallback(() => {
    const { price, price_promotional } = product;
    const promotional = Math.ceil(((price - price_promotional) / price) * 100);

    return promotional;
  }, [product]);

  useEffect(() => {
    const fvt = favorites.findIndex((fav) => fav.id === product.id);
    setFavorite(fvt >= 0);
  }, [signed, favorites, product.id]);

  const handleFavorite = () => {
    if (!signed) {
      navigation.navigate("Account");
    } else {
      dispatch(
        !favorite
          ? addToFavoritesRequest(product.id)
          : removeFromFavoritesRequest(product.id)
      );
      setFavorite(!favorite);
    }
  };

  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView contentContainerStyle={{ height: 700 }}>
          <View style={{ flex: 1, position: "relative" }}>
            <BackButton
              onPress={() => {
                navigation.goBack();
              }}
              isIphoneX={Platform.OS !== "android" && isIphoneX}
            >
              <Icon name="chevron-left" size={30} color="#fff" />
            </BackButton>

            <ProductImage source={{ uri: product.banner }} resizeMode="cover" />

            <ProductInfo>
              <ProductPrice>
                <PriceContainer>
                  {product.has_promotion ? (
                    <>
                      <OldPrice>{`€ ${product.price}`}</OldPrice>

                      <OldPriceLabel>por</OldPriceLabel>

                      <Price>{`€ ${product.price_promotional}`}</Price>
                    </>
                  ) : (
                    <Price>{`€ ${product.price}`}</Price>
                  )}
                </PriceContainer>

                <PromotionalContainer>
                  {product.has_promotion && (
                    <Promotional>
                      <Icon name="local-offer" size={14} color="#F7D100" />
                      <PromotionalPrice>{`-${handlePromotionalPercentage()}%`}</PromotionalPrice>
                    </Promotional>
                  )}
                </PromotionalContainer>

                <FavoriteContainer onPress={handleFavorite} disabled={updating}>
                  {favorite ? (
                    <Icon name="favorite" color="#f6b32a" size={30} />
                  ) : (
                    <Icon name="favorite-border" color="#f6b32a" size={30} />
                  )}
                </FavoriteContainer>
              </ProductPrice>

              <ProductNameContainer>
                <Text style={{ fontSize: 20, marginVertical: 10 }}>
                  {product.title}
                </Text>
              </ProductNameContainer>

              <DescriptionButtonContainer>
                <SeeDescription onPress={() => setDescriptionOpen(true)}>
                  <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    Ver Descrição
                  </Text>
                </SeeDescription>

                <AmountButtonContainer>
                  <AmountButton
                    disabled={amount === 0}
                    onPress={() => setAmount(amount - 1)}
                  >
                    <Icon name="remove" size={25} color="black" />
                  </AmountButton>

                  <Amount>{amount}</Amount>

                  <AmountButton onPress={() => setAmount(amount + 1)}>
                    <Icon name="add" size={25} color="black" />
                  </AmountButton>
                </AmountButtonContainer>
              </DescriptionButtonContainer>
            </ProductInfo>

            <MinimalPrice>
              <Text style={{ color: "#fff" }}>{minValueShipping}</Text>
            </MinimalPrice>

            <CreditContainer>
              <ShippingContainer>
                <Shipping>Porte:</Shipping>

                <ShippingPrice>
                  {shippingCost > 0 ? `€ ${shippingCost}` : "Grátis"}
                </ShippingPrice>
              </ShippingContainer>

              <Text style={{ fontSize: 14, color: "#F48312" }}>
                {freeShippingMessage}
              </Text>

              {product.cback !== undefined && product.cback > 0.0 && (
                <Text style={{ fontSize: 15, color: "#259d41" }}>
                  Receba {`€ ${product.cback}`} de volta para a próxima compra
                </Text>
              )}

              <ShippingContainer>
                <Text style={{ color: "#9A9A9A", fontSize: 14 }}>Para</Text>

                <ShippingDestination>Lisboa</ShippingDestination>

                <Text style={{ color: "#9A9A9A", fontSize: 14 }}>
                  via AM Frutas
                </Text>
              </ShippingContainer>

              <ShippingContainer>
                <Text style={{ fontSize: 15 }}>Tempo de entrega:</Text>

                <Text style={{ fontSize: 15, color: "#259D41", marginLeft: 3 }}>
                  {shippingDeadline}
                </Text>
              </ShippingContainer>
            </CreditContainer>

            <WarrantyContainer>
              <ShieldContainer>
                <Shield />

                <Text style={{ marginLeft: 10 }}>
                  Garantia de produtos frescos
                </Text>
              </ShieldContainer>
            </WarrantyContainer>
          </View>
        </ScrollView>

        <AddToCartContainer>
          <WhatsAppButton onPress={sendWhatsappMessage}>
            <WhatsAppIcon height={25} width={25} style={{ marginBottom: 5 }} />

            <Text style={{ textAlign: "center", fontSize: 12 }}>
              Contato Via WhatsApp
            </Text>
          </WhatsAppButton>

          <AddToCartButton
            disabled={amount === 0}
            onPress={() => {
              handleAddToCart();
              Toast.showSuccess("Produto adicionado ao cesto");
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Adicionar ao Cesto
            </Text>
          </AddToCartButton>
        </AddToCartContainer>

        <Modal
          visible={openDescription}
          onRequestClose={() => setDescriptionOpen(false)}
          transparent
        >
          <TransparentBackground>
            <OffArea onPress={() => setDescriptionOpen(false)} />
            <DescriptionContainer>
              <DescriptionHeader>
                <DescriptionHeaderText>
                  Descrição do Produto
                </DescriptionHeaderText>

                <CloseDescription onPress={() => setDescriptionOpen(false)}>
                  <CustomIcon name="x" size={30} color="#aaa" />
                </CloseDescription>
              </DescriptionHeader>

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 11 }}
              >
                <HTML
                  html={productDescription}
                  tagsStyles={{
                    p: {
                      color: "#212121",
                      fontSize: 18,
                      lineHeight: 25,
                      marginVertical: 7,
                      paddingHorizontal: 5,
                    },
                  }}
                />
              </ScrollView>
            </DescriptionContainer>
          </TransparentBackground>
        </Modal>
      </View>
    </>
  );
}

Product.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      item: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        price: PropTypes.string,
        cback: PropTypes.string,
        price_promotional: PropTypes.string,
        has_promotion: PropTypes.bool,
        banner: PropTypes.string,
        thumbs: PropTypes.string,
      }),
    }),
  }).isRequired,
};
