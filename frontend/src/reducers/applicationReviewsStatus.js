import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_APPLICATION_REVIEWS_ERROR = 'CLEAR_APPLICATION_REVIEWS_ERROR';
export const LOAD_APPLICATION_REVIEWS_STARTED = 'LOAD_APPLICATION_REVIEWS_STARTED';
export const LOAD_APPLICATION_REVIEWS_ENDED = 'LOAD_APPLICATION_REVIEWS_ENDED';
export const LOAD_APPLICATION_REVIEWS_SUCCESS = 'LOAD_APPLICATION_REVIEWS_SUCCESS';
export const LOAD_APPLICATION_REVIEWS_FAILURE = 'LOAD_APPLICATION_REVIEWS_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load reviews for this application, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_APPLICATION_REVIEWS_ERROR });
export const loadApplicationReviewsStarted = () => ({ type: LOAD_APPLICATION_REVIEWS_STARTED });
export const loadApplicationReviewsEnded = () => ({ type: LOAD_APPLICATION_REVIEWS_ENDED });
export const loadApplicationReviewsSuccess = (reviews, applicationId) => (
  { type: LOAD_APPLICATION_REVIEWS_SUCCESS, reviews, applicationId });
export const loadApplicationReviewsFailure = error => (
  { type: LOAD_APPLICATION_REVIEWS_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error.message || action.error.response.data,
  },
  state);


export default function applicationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATION_REVIEWS_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATION_REVIEWS_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_APPLICATION_REVIEWS_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_APPLICATION_REVIEWS_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
