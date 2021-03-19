import React from 'react';
import { Image } from 'react-native';

import { ActivityIndicatorContainer, Label } from './styles';
import ImageSource from '~/assets/loader.gif';

export default function Loader() {
  return (
    <ActivityIndicatorContainer>
      <Image source={ImageSource} style={{
        height: 150,
        width: 150
      }} />
    </ActivityIndicatorContainer>
  );
}