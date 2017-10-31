import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_CFEI_REVIEW_SUMMARY_ERROR = 'CLEAR_CFEI_REVIEW_SUMMARY_ERROR';
export const LOAD_CFEI_REVIEW_SUMMARY_STARTED = 'LOAD_CFEI_REVIEW_SUMMARY_STARTED';
export const LOAD_CFEI_REVIEW_SUMMARY_ENDED = 'LOAD_CFEI_REVIEW_SUMMARY_ENDED';
export const LOAD_CFEI_REVIEW_SUMMARY_SUCCESS = 'LOAD_CFEI_REVIEW_SUMMARY_SUCCESS';
export const LOAD_CFEI_REVIEW_SUMMARY_FAILURE = 'LOAD_CFEI_REVIEW_SUMMARY_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load review summary, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_CFEI_REVIEW_SUMMARY_ERROR });
export const loadCfeiReviewSummaryStarted = () => ({ type: LOAD_CFEI_REVIEW_SUMMARY_STARTED });
export const loadCfeiReviewSummaryEnded = () => ({ type: LOAD_CFEI_REVIEW_SUMMARY_ENDED });
export const loadCfeiReviewSummarySuccess = (summary, id) => (
  { type: LOAD_CFEI_REVIEW_SUMMARY_SUCCESS, summary, id });
export const loadCfeiReviewSummaryFailure = error => (
  { type: LOAD_CFEI_REVIEW_SUMMARY_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function cfeiReviewSummaryStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_CFEI_REVIEW_SUMMARY_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_CFEI_REVIEW_SUMMARY_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_CFEI_REVIEW_SUMMARY_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_CFEI_REVIEW_SUMMARY_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
