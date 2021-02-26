import styled from 'styled-components/native';

export const Item = styled.View`
  width: 100%;
  border-width: 1px;
  background: #fff;
  border-color: #efefef;
  justify-content: flex-start;
  position: relative;
  margin-bottom: 20px;
`;

export const Order = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom-color: #efefef;
  border-bottom-width: 1px;
  padding: 5px 15px 8px;
`;

export const OrderNumberContainer = styled.View`
  align-items: flex-start;
  justify-content: center;
  border-bottom-color: #efefef;
  border-bottom-width: 1px;
  padding: 10px 15px;
`;

export const ContentContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Content = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #283d48;
  line-height: 25px;
`;

export const Details = styled.TouchableOpacity`
  background-color: #cbced0;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
`;

export const ShippingDetails = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  padding: 5px 15px 10px;
`;

export const DeliveryStatus = styled.View`
  flex: 1;
  align-items: flex-start;
`;

export const ShippingStatus = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #f06d85;
`;
