import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import HTML from 'react-native-render-html';
import PropTypes from 'prop-types';
import { isIphoneX } from 'react-native-iphone-x-helper';

import api from '~/services/api';

import PlaceholderImage from '~/assets/placeholder.svg';

import {
  Container,
  Header,
  TextContainer,
  Title,
  ImageContainer,
  Thumb,
} from './styles';

Icon.loadFont();

export default function Content({ navigation, route }) {
  const [pageInfo, setPageInfo] = useState(
    '<div style="align-items:center"><h3 style="color: #999">Carregando...</h1></div>'
  );
  const [title, setTitle] = useState(route.params.title);
  const [thumb, setThumb] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerOpacity] = useState(new Animated.Value(0));

  const { endpoint } = route.params;

  useEffect(() => {
    async function loadData() {
      const response = await api.get(`${endpoint}`);

      setPageInfo(response.data.data.description);
      setTitle(response.data.data.title);
      setThumb(response.data.data.thumbs);
      setBanner(response.data.data.banner);
    }

    loadData();
  }, []);

  const showBanner = () => {
    Animated.timing(bannerOpacity, {
      toValue: 1,
      delay: 500,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Header isIphoneX={Platform.OS !== 'android' && isIphoneX}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon size={35} name="chevron-left" color="#EEE" />
        </TouchableOpacity>

        <Title>{title}</Title>
      </Header>

      <Container>
        {banner !== null ? (
          <ImageContainer>
            <Thumb
              width={Dimensions.get('window').width}
              source={{
                uri: `${thumb}`,
              }}
              resizeMode="cover"
              blurRadius={5}
            />

            <Animated.Image
              resizeMode="cover"
              onLoad={showBanner}
              source={{
                uri: `${banner}`,
              }}
              style={{
                position: 'absolute',
                opacity: bannerOpacity,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width,
              }}
            />
          </ImageContainer>
        ) : (
          <PlaceholderImage width="100%" height={165} />
        )}

        <TextContainer>
          <HTML
            html={pageInfo}
            staticContentMaxWidth={Dimensions.get('window').width - 30}
            imagesInitialDimensions={{
              width: Dimensions.get('window').width - 30,
              height: Math.round((Dimensions.get('window').width * 9) / 16),
            }}
            tagsStyles={{
              img: {
                borderRadius: 10,
                marginBottom: 10,
              },
              p: {
                fontSize: 17,
                marginBottom: 15,
                lineHeight: 30,
              },
              strong: {
                fontSize: 17,
                marginBottom: 15,
                lineHeight: 30,
                fontWeight: 'bold',
              },
              li: {
                fontSize: 17,
                fontWeight: 'bold',
              },
              h1: {
                fontSize: 20,
                fontWeight: 'bold',
              },
              iframe: {
                width: Dimensions.get('window').width - 30,
                height: Math.round((Dimensions.get('window').width * 9) / 16),
              },
            }}
          />
        </TextContainer>
      </Container>
    </>
  );
}

Content.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      endpoint: PropTypes.string,
      title: PropTypes.string,
    }),
  }).isRequired,
};
