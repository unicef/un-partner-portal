
import { combineReducers } from 'redux';
import { getAgencies } from '../helpers/api/api';
import {
  toObject,
  flattenToObjectKey,
  selectIndexWithDefaultNull,
} from './normalizationHelpers';
import { getNewRequestToken } from '../helpers/apiHelper';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';

const initialState = {};
const LOAD_AGENCIES_NAMES_SUCCESS = 'LOAD_AGENCY_NAMES_SUCCESS';
const tag = 'agencies';
const AGENCIES = 'AGENCIES';

const loadAgenciesNamesSuccess = names => ({ type: LOAD_AGENCIES_NAMES_SUCCESS, names });

export const loadAgenciesNames = all => (dispatch, getState) => {
  const newCancelToken = getNewRequestToken(getState, tag);
  dispatch(loadStarted(AGENCIES, newCancelToken));
  const params = { page_size: 100, exclude: all ? '' : 'other' };

  return getAgencies(params, { cancelToken: newCancelToken.token })
    .then((names) => {
      dispatch(loadEnded(AGENCIES));
      dispatch(loadSuccess(AGENCIES, { names: names.results }));
      return names;
    }).catch((error) => {
      dispatch(loadEnded(AGENCIES));
      dispatch(loadFailure(AGENCIES, error));
    });
};

export const selectAgenciesName = (state, id) => {
  const agency = selectIndexWithDefaultNull(id, state);
  return agency;
};

const saveAgenciesNames = action =>
  toObject(flattenToObjectKey('name'), action.names);


function agencies(state = initialState, action) {
  switch (action.type) {
    case success`${AGENCIES}`: {
      return saveAgenciesNames(action);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: agencies, status: apiMeta(AGENCIES) });
