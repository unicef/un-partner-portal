import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiReviewSummaryStatus, {
  loadCfeiReviewSummaryStarted,
  loadCfeiReviewSummaryEnded,
  loadCfeiReviewSummarySuccess,
  loadCfeiReviewSummaryFailure,
  LOAD_CFEI_REVIEW_SUMMARY_SUCCESS,
} from './cfeiReviewSummaryStatus';
import { selectIndexWithDefaultEmptyObject } from './normalizationHelpers';
import { getCfeiReviewSummary, putCfeiReviewSummary } from '../helpers/api/api';

const initialState = {};

export const loadReviewSummary = cfeiId => (dispatch) => {
  dispatch(loadCfeiReviewSummaryStarted());
  return getCfeiReviewSummary(cfeiId)
    .then((summary) => {
      dispatch(loadCfeiReviewSummaryEnded());
      dispatch(loadCfeiReviewSummarySuccess(summary, cfeiId));
      return summary;
    })
    .catch((error) => {
      dispatch(loadCfeiReviewSummaryEnded());
      dispatch(loadCfeiReviewSummaryFailure(error));
    });
};

export const updateReviewSummary = (cfeiId, body) => dispatch =>
  putCfeiReviewSummary(cfeiId, body)
    .then((summary) => {
      dispatch(loadCfeiReviewSummarySuccess(summary, cfeiId));
      return summary;
    });

const saveReviewSummary = (state, action) =>
  R.assoc(action.id, action.summary, state);

export function selectReviewSummary(state, cfeiId) {
  return selectIndexWithDefaultEmptyObject(cfeiId, state);
}

const cfeiReviewSummary = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_REVIEW_SUMMARY_SUCCESS: {
      return saveReviewSummary(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: cfeiReviewSummary, status: cfeiReviewSummaryStatus });
