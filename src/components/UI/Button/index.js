
import React from 'react';

import LoadingSpinner from 'components/UI/LoadingSpinner';
import './button.css';

const Button = ({
  loading,
  disabled,
  className,
  children,
  ...rest
}) => (
  <button
    {...rest}
    className={`button font-weight-bold typography-button ${className}`}
    disabled={disabled || loading}>
    {loading ? (
    <LoadingSpinner
      width={24}
      height={24}
      borderWidth={.4}
      margin={0} />
    ) : (
      <>
        {children}
      </>
    )}
  </button>
);

export default Button;
