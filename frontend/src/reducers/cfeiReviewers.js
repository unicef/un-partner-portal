import { combineReducers } from 'redux';
import R from 'ramda';
import { selectIndexWithDefaultEmptyArray } from './normalizationHelpers';
import { getCfeiReviewers } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';

const errorMessage = 'Couldn\'t load reviewers list, please refresh page and try again';

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
