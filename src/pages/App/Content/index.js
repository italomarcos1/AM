import React, { useEffect, useState } from 'react';
import { Dimensions, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import HTML from 'react-native-render-html';
import PropTypes from 'prop-types';

import api from '~/services/api';

import { showTabBar, resetTrigger } from '~/store/modules/user/actions';

import PlaceholderImage from '~/assets/placeholder.svg';

import {
  Container,
  TextContainer,
  Title,
  ImageContainer,
  Thumb,
} from './styles';

export default function ContentScreen({ route }) {
  const [htmlContent, setHtmlContent] = useState(
    '<div style="align-items:center"><h3 style="color: #999">Carregando...</h1></div>'
  );
  const [title, setTitle] = useState('');
  const [thumb, setThumb] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bannerOpacity] = useState(new Animated.Value(0));
  const [contentId] = useState(route.params.contentId);

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadPage() {
      const response = await api.get(`blog/contents/${contentId}`);
      setHtmlContent(response.data.data.description);
      setTitle(response.data.data.title);
      setThumb(response.data.data.thumbs);
      setBanner(response.data.data.thumbs);
    }

    dispatch(showTabBar());
    dispatch(resetTrigger());

    loadPage();
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
        <Title>{title}</Title>
        <HTML
          html={htmlContent}
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
  );
}

ContentScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      contentId: PropTypes.number,
    }),
  }).isRequired,
};
