
import React, { memo } from 'react';

import LogInFab from 'components/LogInFab';
import LogOutFab from 'components/LogOutFab';
import LibraryFab from 'components/LibraryFab';
import './footer.css';

const Footer = ({
  loading,
  signedIn,
  signIn,
  signOut,
  navigateToGallery
}) => (
  <footer className='footer'>
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
  </footer>
);

export default memo(Footer);
