import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_PARTNERS_FLAGS_ERROR = 'CLEAR_PARTNERS_FLAGS_ERROR';
export const LOAD_PARTNERS_FLAGS_STARTED = 'LOAD_PARTNERS_FLAGS_STARTED';
export const LOAD_PARTNERS_FLAGS_ENDED = 'LOAD_PARTNERS_FLAGS_ENDED';
export const LOAD_PARTNERS_FLAGS_SUCCESS = 'LOAD_PARTNERS_FLAGS_SUCCESS';
export const LOAD_PARTNERS_FLAGS_FAILURE = 'LOAD_PARTNERS_FLAGS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load review summary, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_PARTNERS_FLAGS_ERROR });
export const loadPartnerFlagsStarted = () => ({ type: LOAD_PARTNERS_FLAGS_STARTED });
export const loadPartnerFlagsEnded = () => ({ type: LOAD_PARTNERS_FLAGS_ENDED });
export const loadPartnerFlagsSuccess = (flags, partnerId, count) => (
  { type: LOAD_PARTNERS_FLAGS_SUCCESS, flags, partnerId, count });
export const loadPartnerFlagsFailure = error => (
  { type: LOAD_PARTNERS_FLAGS_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function PartnerFlagsStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_PARTNERS_FLAGS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_PARTNERS_FLAGS_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_PARTNERS_FLAGS_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_PARTNERS_FLAGS_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
