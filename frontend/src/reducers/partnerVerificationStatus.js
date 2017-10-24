import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_PARTNER_VERIFICATIONS_ERROR = 'CLEAR_PARTNER_VERIFICATIONS_ERROR';
export const LOAD_PARTNER_VERIFICATIONS_STARTED = 'LOAD_PARTNER_VERIFICATIONS_STARTED';
export const LOAD_PARTNER_VERIFICATIONS_ENDED = 'LOAD_PARTNER_VERIFICATIONS_ENDED';
export const LOAD_PARTNER_VERIFICATIONS_SUCCESS = 'LOAD_PARTNER_VERIFICATIONS_SUCCESS';
export const LOAD_PARTNER_VERIFICATIONS_FAILURE = 'LOAD_PARTNER_VERIFICATIONS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load verifications for this partner, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_PARTNER_VERIFICATIONS_ERROR });
export const loadPartnerVerificationsStarted = () => ({ type: LOAD_PARTNER_VERIFICATIONS_STARTED });
export const loadPartnerVerificationsEnded = () => ({ type: LOAD_PARTNER_VERIFICATIONS_ENDED });
export const loadPartnerVerificationsSuccess = (verifications, partnerId) => (
  { type: LOAD_PARTNER_VERIFICATIONS_SUCCESS, verifications, partnerId });
export const loadPartnerVerificationsFailure = error => (
  { type: LOAD_PARTNER_VERIFICATIONS_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error.message || action.error.response.data,
  },
  state);


export default function partnerVerificationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_PARTNER_VERIFICATIONS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_PARTNER_VERIFICATIONS_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_PARTNER_VERIFICATIONS_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_PARTNER_VERIFICATIONS_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
