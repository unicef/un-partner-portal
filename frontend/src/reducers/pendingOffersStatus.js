import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_PENDING_OFFERS_ERROR = 'CLEAR_PENDING_OFFERS_ERROR';
export const LOAD_PENDING_OFFERS_STARTED = 'LOAD_PENDING_OFFERS_STARTED';
export const LOAD_PENDING_OFFERS_ENDED = 'LOAD_PENDING_OFFERS_ENDED';
export const LOAD_PENDING_OFFERS_SUCCESS = 'LOAD_PENDING_OFFERS_SUCCESS';
export const LOAD_PENDING_OFFERS_FAILURE = 'LOAD_PENDING_OFFERS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load pending offers, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_PENDING_OFFERS_ERROR });
export const loadPendingOffersStarted = () => ({ type: LOAD_PENDING_OFFERS_STARTED });
export const loadPendingOffersEnded = () => ({ type: LOAD_PENDING_OFFERS_ENDED });
export const loadPendingOffersSuccess = (offers, count) => (
  { type: LOAD_PENDING_OFFERS_SUCCESS, offers, count });
export const loadPendingOffersFailure = error => (
  { type: LOAD_PENDING_OFFERS_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function pendingOffersStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_PENDING_OFFERS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_PENDING_OFFERS_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_PENDING_OFFERS_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_PENDING_OFFERS_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
