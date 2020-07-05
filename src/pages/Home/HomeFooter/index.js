
import React, { memo } from 'react';

import LogInFab from 'components/LogInFab';
import LogOutFab from 'components/LogOutFab';
import LibraryFab from 'components/LibraryFab';
// ray test touch <
import FooterWrapper from 'parts/FooterWrapper';
// ray test touch >
import './home-footer.css';

const HomeFooter = ({
  loading,
  signedIn,
  signIn,
  signOut,
  navigateToGallery
}) => (
  // ray test touch <
  <FooterWrapper className='home-footer'>
    {signedIn ? (
      <LogOutFab
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
  // ray test touch >
);

export default memo(HomeFooter);
