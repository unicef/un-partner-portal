import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_CFEI_AWARDED_PARTNERS_ERROR = 'CLEAR_CFEI_AWARDED_PARTNERS_ERROR';
export const LOAD_CFEI_AWARDED_PARTNERS_STARTED = 'LOAD_CFEI_AWARDED_PARTNERS_STARTED';
export const LOAD_CFEI_AWARDED_PARTNERS_ENDED = 'LOAD_CFEI_AWARDED_PARTNERS_ENDED';
export const LOAD_CFEI_AWARDED_PARTNERS_SUCCESS = 'LOAD_CFEI_AWARDED_PARTNERS_SUCCESS';
export const LOAD_CFEI_AWARDED_PARTNERS_FAILURE = 'LOAD_CFEI_AWARDED_PARTNERS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load awarded partners, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_CFEI_AWARDED_PARTNERS_ERROR });
export const loadCfeiAwardedPartnersStarted = () => ({ type: LOAD_CFEI_AWARDED_PARTNERS_STARTED });
export const loadCfeiAwardedPartnersEnded = () => ({ type: LOAD_CFEI_AWARDED_PARTNERS_ENDED });
export const loadCfeiAwardedPartnersSuccess = (awardedPartners, id) => (
  { type: LOAD_CFEI_AWARDED_PARTNERS_SUCCESS, awardedPartners, id });
export const loadCfeiAwardedPartnersFailure = error => (
  { type: LOAD_CFEI_AWARDED_PARTNERS_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function cfeiAwardedPartnersStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_AWARDED_PARTNERS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_CFEI_AWARDED_PARTNERS_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_CFEI_AWARDED_PARTNERS_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_CFEI_AWARDED_PARTNERS_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
