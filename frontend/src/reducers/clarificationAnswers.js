import { combineReducers } from 'redux';
import R from 'ramda';
import apiMeta, {
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';
import {
  selectIndexWithDefaultEmptyObject,
} from './normalizationHelpers';

import { getClarificationAnswers } from '../helpers/api/api';

export const CLARIFICATIONS_ANSWERS = 'CLARIFICATIONS_ANSWERS';

const initialState = {};

export const loadClarificationAnswers = (cfeiId, params) => (dispatch) => {
  dispatch(loadStarted(CLARIFICATIONS_ANSWERS));

  return getClarificationAnswers(cfeiId, params)
    .then((data) => {
      dispatch(loadEnded(CLARIFICATIONS_ANSWERS));
      dispatch(loadSuccess(CLARIFICATIONS_ANSWERS, { data, cfeiId }));
      return data;
    })
    .catch((error) => {
      dispatch(loadEnded(CLARIFICATIONS_ANSWERS));
      dispatch(loadFailure(error, CLARIFICATIONS_ANSWERS));
    });
};

const saveAnswers = (state, action) => R.assoc(action.cfeiId,
  { answers: action.data.results, count: action.data.count }, state);

export const selectAnswers = (state, cfeiId) => {
  const { answers = [] } = selectIndexWithDefaultEmptyObject(cfeiId, state.data);
  return answers;
};

export const selectCount = (state, cfeiId) => {
  const { count = 0 } = selectIndexWithDefaultEmptyObject(cfeiId, state.data);
  return count;
};

const clarificationAnswersReducer = (state = initialState, action) => {
  switch (action.type) {
    case `LOAD_${CLARIFICATIONS_ANSWERS}_SUCCESS`: {
      return saveAnswers(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: clarificationAnswersReducer,
  status: apiMeta(CLARIFICATIONS_ANSWERS) });
