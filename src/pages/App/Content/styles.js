import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  background: #fff;
`;

export const TextContainer = styled.View`
  padding: 0 15px 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  text-transform: uppercase;
  color: #12b118;
  margin: 10px 0 15px;
  font-weight: bold;
  text-align: center;
`;

export const ImageContainer = styled.View`
  position: relative;
`;

export const Thumb = styled.Image`
  width: ${props => props.width}px;
  height: ${props => props.width}px;
`;
