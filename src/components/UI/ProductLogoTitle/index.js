/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Link } from 'react-router-dom';

import './product-logo-title.css';
import config from 'config';
import { PAGES } from 'utils/constants/links';

const ProductLogoTitle = () => (
  <div className='product-logo-title'>
    <Link
      to={PAGES.HOME}
      className='product-link'
      data-label='Project Logo (header)'>
      <img
        width={64}
        height={64}
        src='/assets/images/logo/smiley-racoon-selfie-512.png'
        className='product-logo'
        alt='Smiley Racoon Selfie' />
    </Link>
    <Link
      to={PAGES.HOME}
      className='product-title'
      data-label='Upper Header'>
      {config.APP_NAME}
    </Link>
  </div>
);

export default ProductLogoTitle;
