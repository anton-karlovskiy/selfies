
import React, { lazy, Suspense } from 'react';

import LoadingSpinner from 'components/UI/LoadingSpinner';

const ImagesModal = lazy(() => {
  return new Promise(resolve => {
    navigator.connection ? resolve(navigator.connection.effectiveType) : resolve(null);
  }).then(
    effectiveType => {
      console.log('[ImagesModal] effectiveType => ', effectiveType);
      switch (effectiveType) {
        case '4g':
          return import(/* webpackChunkName: 'images-modal' */ './ImagesModal');
        case '3g':
        case '2g':
        case 'slow-2g':
          // ray test touch <<
          // return null;
          return import(/* webpackChunkName: 'images-modal' */ './ImagesModal');
          // ray test touch >>
        default:
          return import(/* webpackChunkName: 'images-modal' */ './ImagesModal');
      }
    }
  );
});

const AdaptiveImagesModal = ({
  open,
  views,
  onClose,
  currentIndex
}) => (
  <>
    {open && (
      <Suspense fallback={<LoadingSpinner />}>
        <ImagesModal
          views={views}
          onClose={onClose}
          currentIndex={currentIndex} />
      </Suspense>
    )}
  </>
);

export default AdaptiveImagesModal;
