import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiReviewersStatus, {
  loadCfeiReviewersStarted,
  loadCfeiReviewersEnded,
  loadCfeiReviewersSuccess,
  loadCfeiReviewersFailure,
  LOAD_CFEI_REVIEWERS_SUCCESS,
} from './cfeiReviewersStatus';
import { selectIndexWithDefaultEmptyArray } from './normalizationHelpers';
import { getCfeiReviewers } from '../helpers/api/api';

const initialState = {};

export const loadReviewers = cfeiId => (dispatch) => {
  dispatch(loadCfeiReviewersStarted());
  return getCfeiReviewers(cfeiId)
    .then((reviewers) => {
      dispatch(loadCfeiReviewersEnded());
      dispatch(loadCfeiReviewersSuccess(reviewers, cfeiId));
      return reviewers;
    })
    .catch((error) => {
      dispatch(loadCfeiReviewersEnded());
      dispatch(loadCfeiReviewersFailure(error));
    });
};

const saveReviewers = (state, action) =>
  R.assoc(action.id, action.reviewers, state);

export function selectReviewers(state, cfeiId) {
  return selectIndexWithDefaultEmptyArray(cfeiId, state);
}

const cfeiReviewers = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_REVIEWERS_SUCCESS: {
      return saveReviewers(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: cfeiReviewers, status: cfeiReviewersStatus });
