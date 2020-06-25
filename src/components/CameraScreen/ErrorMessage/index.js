
import React from 'react';

import './error-message.css';

const ErrorMessage = ({ children }) => (
  <h3 className='error-message'>
    {children}
  </h3>
);

export default ErrorMessage;
