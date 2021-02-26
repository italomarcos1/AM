import React, { forwardRef, useState } from 'react';
import { TouchableOpacity, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Container, CustomInput, Label } from './styles';

Icon.loadFont();

function InputMenu(
  { label, card = false, help = false, clear, style = {}, ...rest },
  ref
) {
  const [selected, setSelected] = useState(false);

  return (
    <Container selected={selected} style={style}>
      {label && <Label>{label}</Label>}
      {card && (
        <Icon
          name="credit-card"
          color="#76797E"
          size={20}
          style={{ marginHorizontal: 3 }}
        />
      )}
      <CustomInput
        {...rest}
        ref={ref}
        hasLabel={!!label}
        onFocus={() => {
          setSelected(true);
        }}
        onBlur={() => {
          setSelected(false);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          clear();
          Keyboard.dismiss();
        }}
      >
        {!card && !help && <Icon name="x-circle" color="#76797E" size={15} />}
        {help && <Icon name="help-circle" color="#76797E" size={15} />}
      </TouchableOpacity>
    </Container>
  );
}

export default forwardRef(InputMenu);
