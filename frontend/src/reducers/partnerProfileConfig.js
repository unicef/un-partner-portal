import { getPartnerProfileConfig } from '../helpers/api/api';

export const LOAD_PARTNER_CONFIG_SUCCESS = 'LOAD_PARTNER_CONFIG_SUCCESS';

const initialState = {};

const loadPartnerConfigSuccess = config => ({ type: LOAD_PARTNER_CONFIG_SUCCESS, config });

export const loadPartnerConfig = () => (dispatch) => {
  if (!window.localStorage.partnerConfig) {
    return getPartnerProfileConfig()
      .then((config) => {
        window.localStorage.setItem('partnerConfig', JSON.stringify(config));
        return dispatch(loadPartnerConfigSuccess(config));
      });
  }
  return dispatch(loadPartnerConfigSuccess(JSON.parse(window.localStorage.partnerConfig)));
};

export default function partnerProfileConfigReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PARTNER_CONFIG_SUCCESS: {
      return action.config;
    }
    default:
      return state;
  }
}
