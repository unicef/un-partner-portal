import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiDetailsStatus, {
  loadCfeiDetailStarted,
  loadCfeiDetailEnded,
  loadCfeiDetailSuccess,
  loadCfeiDetailFailure,
  LOAD_CFEI_DETAIL_SUCCESS,
} from './cfeiDetailsStatus';
import { } from './apiStatus';
import { normalizeSingleCfei } from './cfei';
import { getOpenCfeiDetails } from '../helpers/api/api';

const initialState = {};

export const loadCfei = id => (dispatch) => {
  dispatch(loadCfeiDetailStarted());
  return getOpenCfeiDetails(id)
    .then((cfei) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailSuccess(cfei));
    })
    .catch((error) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailFailure(error));
    });
};

const saveCfei = (state, action) => {
  const cfei = normalizeSingleCfei(action.cfei);
  return R.assoc(cfei.id, cfei, state);
};

export function selectCfeiDetail(state, id) {
  return state[id] || null;
}

export function selectCfeiTitle(state, id) {
  return state[id] ? state[id].title : '';
}

const cfeiDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_DETAIL_SUCCESS: {
      return saveCfei(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ cfeiDetails, cfeiDetailsStatus });
