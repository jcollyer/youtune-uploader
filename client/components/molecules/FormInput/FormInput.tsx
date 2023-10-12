import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Field from 'react-bulma-companion/lib/Field';
import Control from 'react-bulma-companion/lib/Control';
import Input from 'react-bulma-companion/lib/Input';
import Icon from 'react-bulma-companion/lib/Icon';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
  className?: string,
  onChange: (event:React.ChangeEvent<HTMLInputElement>) => void,
  value: string,
  placeholder: string,
  type?: string,
  leftIcon?: IconProp,
  rightIcon?: IconProp,
};

export default function FormInput({
  className = '',
  onChange,
  value,
  placeholder,
  type = 'text',
  leftIcon = undefined,
  rightIcon = undefined,
}:Props):JSX.Element {
  return (
    <Field className={className}>
      <Control iconsLeft={!!leftIcon} iconsRight={!!rightIcon}>
        <Input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
        {leftIcon && (
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={leftIcon} />
          </Icon>
        )}
        {rightIcon && (
          <Icon size="small" align="left">
            <FontAwesomeIcon icon={rightIcon} />
          </Icon>
        )}
      </Control>
    </Field>
  );
}
