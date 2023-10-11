import React from 'react';
import classNames from 'classnames';

type Props = {
  className: string,
  style: any,
  label: string,
  type: string,
  size: string,
  onClick: () => any,
  outlined: boolean,
  inverted: boolean,
  rounded: boolean,
  hovered: boolean,
  focused: boolean,
  active: boolean,
  loading: boolean,
  static: boolean,
  disabled: boolean,
};

type typeMapProps = {
  [key: string]: string,
};

type sizeMapProps = {
  [key: string]: string,
};

export default function Button(props:Props) {
  const {
    className, onClick, label, style, type, size, outlined,
    inverted, rounded, hovered, focused, active, loading, disabled,
  } = props;

  const typeMap:typeMapProps = {
    info: 'is-info',
    primary: 'is-primary',
    success: 'is-success',
    warning: 'is-warning',
    danger: 'is-danger',
  };

  const sizeMap:sizeMapProps = {
    small: 'is-small',
    normal: '',
    medium: 'is-medium',
    large: 'is-large',
  };

  const isType = typeMap[type] || 'is-info';
  const isSize = sizeMap[size] || '';

  const buttonClasses = classNames({
    [className]: !!className,
    'button': true,
    [isType]: true,
    [isSize]: true,
    'is-outlined': outlined,
    'is-inverted': inverted,
    'is-rounded': rounded,
    'is-hovered': hovered,
    'is-focused': focused,
    'is-active': active,
    'is-loading': loading,
    'is-static': props.static,
  });

  return (
    <button
      style={style}
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
