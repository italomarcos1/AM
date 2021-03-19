import styled from 'styled-components/native';

export const Header = styled.View`
  background-color: #12b118;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${props => (props.isIphoneX ? '50px' : '10px')} 10px 10px;
`;

export const Title = styled.Text`
  font-size: 15px;
  color: #fff;
  line-height: 20px;
  margin-left: 10px;
  text-transform: uppercase;
  flex: 1;
`;

export const Container = styled.ScrollView`
  background-color: #fff;
`;

export const TextContainer = styled.ScrollView`
  padding: 15px 15px 30px;
  text-align: justify;
`;

export const ImageContainer = styled.View`
  position: relative;
`;

export const Thumb = styled.Image`
  width: ${props => props.width}px;
  height: ${props => props.width}px;
`;
