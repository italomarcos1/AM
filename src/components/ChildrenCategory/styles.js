import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Line = styled.View`
  background: #eee;
  height: 1px;
`;

export const OptionsContainer = styled.View`
  background-color: #fff;
  padding: 5px 15px;
  width: 100%;
  margin-top: 10px;
  flex: 1;
  padding-bottom: 10px;
`;

export const OptionsTitle = styled.Text`
  font-size: 20px;
  margin: 6px 0;
  font-weight: bold;
  color: #12b118;
`;

export const Option = styled.TouchableOpacity`
  width: 100%;
  align-self: stretch;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 5px;
`;

export const OptionText = styled.Text`
  font-size: 16px;
`;

export const Header = styled.View`
  background-color: #12b118;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: ${props => (props.isIphoneX ? '50px' : '10px')} 10px 10px;
`;

export const SubContainer = styled.View`
  margin-top: 10px;
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
`;
