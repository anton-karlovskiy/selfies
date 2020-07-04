
import { LOCAL_STORAGE_KEYS } from 'utils/constants';
import { saveState } from 'utils/helpers/local-storage';

// TODO: try catch -> catch -> sign out
const getRefreshedOauthToken = () => {
  const user = window.gapi.auth2.getAuthInstance().currentUser.get();
  const oauthToken = user.getAuthResponse().access_token;
  saveState({[LOCAL_STORAGE_KEYS.OAUTH_TOKEN]: oauthToken});

  return oauthToken;
};

export default getRefreshedOauthToken;
