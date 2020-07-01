
import { LOCAL_STORAGE_KEYS } from 'utils/constants';
import { saveState } from 'utils/helpers/local-storage';

const eraseOauthToken = () => {
  saveState({[LOCAL_STORAGE_KEYS.OAUTH_TOKEN]: ''});
};

export default eraseOauthToken;
