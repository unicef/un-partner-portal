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

import { getOpenCfeiApplications } from '../helpers/api/api';

export const RECOMMENDED_PARTNERS = 'RECOMMENDED_PARTNERS';

const initialState = {};

export const loadRecommendedPartners = (cfeiId, params) => (dispatch) => {
  dispatch(loadStarted(RECOMMENDED_PARTNERS));

  return getOpenCfeiApplications(cfeiId, params)
    .then((data) => {
      dispatch(loadEnded(RECOMMENDED_PARTNERS));
      dispatch(loadSuccess(RECOMMENDED_PARTNERS, { data, cfeiId }));
      return data;
    })
    .catch((error) => {
      dispatch(loadEnded(RECOMMENDED_PARTNERS));
      dispatch(loadFailure(error, RECOMMENDED_PARTNERS));
    });
};

const savePartners = (state, action) => R.assoc(action.cfeiId,
  { partners: action.data.results, count: action.data.count }, state);

export const selectPartners = (state, cfeiId) => {
  const { partners = [] } = selectIndexWithDefaultEmptyObject(cfeiId, state.data);
  return partners;
};

export const selectCount = (state, cfeiId) => {
  const { count = 0 } = selectIndexWithDefaultEmptyObject(cfeiId, state.data);
  return count;
};

const recommendedPartnersReducer = (state = initialState, action) => {
  switch (action.type) {
    case `LOAD_${RECOMMENDED_PARTNERS}_SUCCESS`: {
      return savePartners(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: recommendedPartnersReducer,
  status: apiMeta(RECOMMENDED_PARTNERS) });
