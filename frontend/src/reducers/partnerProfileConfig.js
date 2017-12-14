import { getPartnerProfileConfig } from '../helpers/api/api';
import { sessionError } from '../reducers/session';

export const LOAD_PARTNER_CONFIG_SUCCESS = 'LOAD_PARTNER_CONFIG_SUCCESS';

const initialState = {};

const loadPartnerConfigSuccess = config => ({ type: LOAD_PARTNER_CONFIG_SUCCESS, config });

export const loadPartnerConfig = () => dispatch => getPartnerProfileConfig()
  .then(config => dispatch(loadPartnerConfigSuccess(config)),
  ).catch((error) => {
    dispatch(sessionError(error));
  });

export default function partnerProfileConfigReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PARTNER_CONFIG_SUCCESS: {
      return action.config;
    }
    default:
      return state;
  }
}
