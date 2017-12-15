import { combineReducers } from 'redux';
import R from 'ramda';
import { selectIndexWithDefaultEmptyObject } from './normalizationHelpers';
import { getCfeiReviewSummary, putCfeiReviewSummary } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
  loadSuccess,
} from './apiMeta';

const errorMessage = 'Couldn\'t load review summary, please refresh page and try again';

const CFEI_REVIEW_SUMMARY = 'CFEI_REVIEW_SUMMARY';
const tag = 'cfeiReviewSummary';

const initialState = {};

export const loadReviewSummary = cfeiId => sendRequest({
  loadFunction: getCfeiReviewSummary,
  meta: {
    reducerTag: tag,
    actionTag: CFEI_REVIEW_SUMMARY,
    isPaginated: false,
  },
  successParams: { cfeiId },
  errorHandling: { userMessage: errorMessage },
  apiParams: [cfeiId],
});

export const updateReviewSummary = (cfeiId, body) => dispatch =>
  putCfeiReviewSummary(cfeiId, body)
    .then((summary) => {
      dispatch(loadSuccess(CFEI_REVIEW_SUMMARY, { results: summary, cfeiId }));
      return summary;
    });

const saveReviewSummary = (state, action) =>
  R.assoc(action.cfeiId, action.results, state);

export function selectReviewSummary(state, cfeiId) {
  return selectIndexWithDefaultEmptyObject(cfeiId, state);
}

const cfeiReviewSummary = (state = initialState, action) => {
  switch (action.type) {
    case success`${CFEI_REVIEW_SUMMARY}`: {
      return saveReviewSummary(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: cfeiReviewSummary, status: apiMeta(CFEI_REVIEW_SUMMARY) });
