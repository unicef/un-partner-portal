import { combineReducers } from 'redux';
import R from 'ramda';
import { selectIndexWithDefaultEmptyArray } from './normalizationHelpers';
import { getCfeiReviewers, notifyReviewer } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';
import { errorToBeAdded } from './errorReducer';

const errorMessage = 'Couldn\'t load reviewers list, please refresh page and try again';
const errorNotify = 'Unable to send reminder';
const CFEI_REVIEWERS = 'CFEI_REVIEWERS';
const tag = 'cfeiReviewers';

const initialState = {};

export const loadReviewers = cfeiId => sendRequest({
  loadFunction: getCfeiReviewers,
  meta: {
    reducerTag: tag,
    actionTag: CFEI_REVIEWERS,
    isPaginated: false,
  },
  successParams: { cfeiId },
  errorHandling: { userMessage: errorMessage },
  apiParams: [cfeiId],
});


const saveReviewers = (state, action) =>
  R.assoc(action.cfeiId, action.results, state);

export function selectReviewers(state, cfeiId) {
  return selectIndexWithDefaultEmptyArray(cfeiId, state);
}

export const sendReminder = (id, reviewerId) => dispatch => notifyReviewer(id, reviewerId)
  .then((response) => {
    // use error snackbar to easily display success message
    dispatch(errorToBeAdded(response.success, 'notifyReviewer', response.success));
    dispatch(loadReviewers(id));
  }).catch((error) => {
    dispatch(errorToBeAdded(error, 'notifyReviewer', errorNotify));
  });

const cfeiReviewers = (state = initialState, action) => {
  switch (action.type) {
    case success`${CFEI_REVIEWERS}`: {
      return saveReviewers(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: cfeiReviewers, status: apiMeta(CFEI_REVIEWERS) });
