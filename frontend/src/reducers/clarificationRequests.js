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

import { getClarificationRequests } from '../helpers/api/api';

export const CLARIFICATIONS_REQUESTS = 'CLARIFICATIONS_REQUESTS';

const initialState = {};

export const loadClarificationRequests = (cfeiId, params) => (dispatch) => {
  dispatch(loadStarted(CLARIFICATIONS_REQUESTS));

  return getClarificationRequests(cfeiId, params)
    .then((data) => {
      dispatch(loadEnded(CLARIFICATIONS_REQUESTS));
      dispatch(loadSuccess(CLARIFICATIONS_REQUESTS, { data, cfeiId }));
      return data;
    })
    .catch((error) => {
      dispatch(loadEnded(CLARIFICATIONS_REQUESTS));
      dispatch(loadFailure(error, CLARIFICATIONS_REQUESTS));
    });
};

const saveRequests = (state, action) => R.assoc(action.cfeiId,
  { requests: action.data.results, count: action.data.count }, state);

export const selectRequests = (state, cfeiId) => {
  const { requests = [] } = selectIndexWithDefaultEmptyObject(cfeiId, state.data);
  return requests;
};

export const selectCount = (state, cfeiId) => {
  const { count = 0 } = selectIndexWithDefaultEmptyObject(cfeiId, state.data);
  return count;
};

const clarificationRequestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case `LOAD_${CLARIFICATIONS_REQUESTS}_SUCCESS`: {
      return saveRequests(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: clarificationRequestsReducer,
  status: apiMeta(CLARIFICATIONS_REQUESTS) });
