
import React, { lazy, Fragment, Suspense } from 'react';

import LoadingSpinner from '../LoadingSpinner';

const LazyAdaptiveImagesModal = lazy(() => {
  return new Promise(resolve => {
    navigator.connection ? resolve(navigator.connection.effectiveType) : resolve(null);
  }).then(
    effectiveType => {
      console.log('[LazyAdaptiveImagesModal] effectiveType => ', effectiveType);
      switch(effectiveType) {
        case '4g':
          return import(/* webpackChunkName: 'images-modal' */ './ImagesModal');
        case '3g':
        case '2g':
        case 'slow-2g':
          return null;
        default:
          return import(/* webpackChunkName: 'images-modal' */ './ImagesModal');
      }
    }
  );
});

const AdaptiveImagesModal = ({ isOpen, ...rest }) => (
  <Fragment>
    {/* conditionally render for not loading chunk until modal is open */}
    { isOpen ? (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyAdaptiveImagesModal isOpen={isOpen} { ...rest } />
      </Suspense>
    ) : (
      null
    ) }
  </Fragment>
);

export default AdaptiveImagesModal;
