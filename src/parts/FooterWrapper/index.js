
import React from 'react';

import './footer-wrapper.css';

const FooterWrapper = ({
  className,
  children
}) => (
  <footer className={`footer-wrapper ${className}`}>
    {children}
  </footer>
);

export default FooterWrapper;
