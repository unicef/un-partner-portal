import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_CFEI_REVIEWERS_ERROR = 'CLEAR_CFEI_REVIEWERS_ERROR';
export const LOAD_CFEI_REVIEWERS_STARTED = 'LOAD_CFEI_REVIEWERS_STARTED';
export const LOAD_CFEI_REVIEWERS_ENDED = 'LOAD_CFEI_REVIEWERS_ENDED';
export const LOAD_CFEI_REVIEWERS_SUCCESS = 'LOAD_CFEI_REVIEWERS_SUCCESS';
export const LOAD_CFEI_REVIEWERS_FAILURE = 'LOAD_CFEI_REVIEWERS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load awarded partners, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_CFEI_REVIEWERS_ERROR });
export const loadCfeiReviewersStarted = () => ({ type: LOAD_CFEI_REVIEWERS_STARTED });
export const loadCfeiReviewersEnded = () => ({ type: LOAD_CFEI_REVIEWERS_ENDED });
export const loadCfeiReviewersSuccess = (reviewers, id) => (
  { type: LOAD_CFEI_REVIEWERS_SUCCESS, reviewers, id });
export const loadCfeiReviewersFailure = error => (
  { type: LOAD_CFEI_REVIEWERS_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function cfeiReviewersStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_REVIEWERS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_CFEI_REVIEWERS_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_CFEI_REVIEWERS_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_CFEI_REVIEWERS_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
