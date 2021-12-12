import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 50px 10px 5px;
  flex-direction: row;
  background-color: ${(props) => (props.custom ? "#fff" : "#5bae59")};
`;

export const Title = styled.Text`
  font-size: 20px;
  color: ${(props) => (props.custom ? "#000" : "#fff")};
`;

export const CloseHeader = styled.TouchableOpacity`
  border-radius: 15px;
  margin-right: 10px;
`;
