
import React from 'react';

import LogInFab from 'components/LogInFab';
import LogOutFab from 'components/LogOutFab';
import LibraryFab from 'components/LibraryFab';
import './footer.css';

const Footer = ({
  signedIn,
  signIn,
  signOut,
  navigateToGallery
}) => (
  <footer className='footer'>
    {signedIn ? (
      <LogOutFab onClick={signOut} />
    ) : (
      <LogInFab onClick={signIn} />
    )}
    <LibraryFab
      disabled={!signedIn}
      onClick={navigateToGallery} />
  </footer>
);

export default Footer;
