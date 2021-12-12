import React from 'react';
import PropTypes from 'prop-types';

import {
  Container,
  Item,
  ItemImage,
  ItemInfo,
  ProductTitle,
  Row,
  Value,
  Label,
} from './styles';

export default function OrderItem({ product, last }) {
  return (
    <Container>
      <Item last={last}>
        <ItemImage
          source={{
            uri: product.thumbs,
          }}
        />

        <ItemInfo>
          <ProductTitle numberOfLines={2}>{product.title}</ProductTitle>

          <Row>
            <Label>Quantidade:</Label>
            <Value color="#665" size={15}>
              {product.qty}
            </Value>
          </Row>

          <Row>
            <Label>Preço unitário:</Label>
            <Value color="#ff9000" size={16}>
              € {product.price}
            </Value>
          </Row>

          <Row>
            <Label>Subtotal:</Label>
            <Value>€ {(product.price * product.qty).toFixed(2)}</Value>
          </Row>
        </ItemInfo>
      </Item>
    </Container>
  );
}

OrderItem.propTypes = {
  product: PropTypes.shape({
    thumbs: PropTypes.string,
    title: PropTypes.string,
    qty: PropTypes.number,
    price: PropTypes.number,
  }).isRequired,
  last: PropTypes.bool,
};

OrderItem.defaultProps = {
  last: false,
};
