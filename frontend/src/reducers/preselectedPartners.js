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

export const PRESELECTED_PARTNERS = 'PRESELECTED_PARTNERS';

const initialState = {};

export const loadPreselectedPartners = (cfeiId, params) => (dispatch) => {
  dispatch(loadStarted(PRESELECTED_PARTNERS));

  return getOpenCfeiApplications(cfeiId, params)
    .then((data) => {
      dispatch(loadEnded(PRESELECTED_PARTNERS));
      dispatch(loadSuccess(PRESELECTED_PARTNERS, { data, cfeiId }));
      return data;
    })
    .catch((error) => {
      dispatch(loadEnded(PRESELECTED_PARTNERS));
      dispatch(loadFailure(error, PRESELECTED_PARTNERS));
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

const preselectedPartnersReducer = (state = initialState, action) => {
  switch (action.type) {
    case `LOAD_${PRESELECTED_PARTNERS}_SUCCESS`: {
      return savePartners(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: preselectedPartnersReducer,
  status: apiMeta(PRESELECTED_PARTNERS) });
