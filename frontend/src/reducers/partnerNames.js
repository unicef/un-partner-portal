import R from 'ramda';
import { combineReducers } from 'redux';
import { getPartnerNames } from '../helpers/api/api';
import {
  toObject,
  flattenToObjectKey,
} from './normalizationHelpers';

import { getNewRequestToken } from '../helpers/apiHelper';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';

import { amendPartnersCache } from '../reducers/cache';

const initialState = {};
const LOAD_PATNER_NAMES_SUCCESS = 'LOAD_PATNER_NAMES_SUCCESS';
const PARTNER_NAMES = 'PARTNER_NAMES';
const tag = 'partnerNames';

export const loadPartnerNames = () => dispatch => getPartnerNames()
  .then((names) => {
    dispatch(loadSuccess(PARTNER_NAMES, names));
    return names;
  });

export const selectPartnerName = (state, id) => {
  const partner = state[id] || '';
  return partner;
};

const savePartnerNames = action => toObject(flattenToObjectKey('legal_name'), action.names);

export const loadPartnerNamesForAutoComplete = params => (dispatch, getState) => {
  const newCancelToken = getNewRequestToken(getState, tag);
  dispatch(loadStarted(PARTNER_NAMES, newCancelToken));
  return getPartnerNames(
    { is_hq: 'False', ...params },
    { cancelToken: newCancelToken.token })
    .then((response) => {
      dispatch(loadEnded(PARTNER_NAMES));
      dispatch(amendPartnersCache(response.results));
      return toObject(flattenToObjectKey('legal_name'), response.results);
    }).catch((error) => {
      dispatch(loadEnded(PARTNER_NAMES));
      dispatch(loadFailure(PARTNER_NAMES, error));
    });
};

function partnerNamesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PATNER_NAMES_SUCCESS: {
      return savePartnerNames(action);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: partnerNamesReducer, status: apiMeta(PARTNER_NAMES) });
