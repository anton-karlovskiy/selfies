
import React, { memo } from 'react';

import LogInFab from 'components/LogInFab';
import LogOutFab from 'components/LogOutFab';
import LibraryFab from 'components/LibraryFab';
import FooterWrapper from 'parts/FooterWrapper';
import './home-footer.css';

const HomeFooter = ({
  loading,
  signedIn,
  signIn,
  signOut,
  navigateToGallery
}) => (
  <FooterWrapper className='home-footer'>
    {signedIn ? (
      <LogOutFab
        loading={loading}
        onClick={signOut} />
    ) : (
      <LogInFab
        loading={loading}
        onClick={signIn} />
    )}
    <LibraryFab
      loading={loading}
      disabled={!signedIn}
      onClick={navigateToGallery} />
  </FooterWrapper>
);

export default memo(HomeFooter);
