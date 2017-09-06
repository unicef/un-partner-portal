import R from 'ramda';
import { combineReducers } from 'redux';
import { getOpenCfei, getPinnedCfei, getDirectCfei } from '../helpers/api/api';
import cfeiStatus, {
  loadCfeiStarted,
  loadCfeiEnded,
  loadCfeiSuccess,
  loadCfeiFailure,
  LOAD_CFEI_SUCCESS } from './cfeiStatus';

export const OPEN = 'open';
export const PINNED = 'pinned';
export const DIRECT = 'direct';

const initialState = {
  open: [],
  pinned: [],
  direct: [],
};

const getCfei = (project, filters) => {
  switch (project) {
    case OPEN:
    default:
      return getOpenCfei(filters);
    case PINNED:
      return getPinnedCfei(filters);
    case DIRECT:
      return getDirectCfei(filters);
  }
};

export const loadCfei = (project, filters) => (dispatch) => {
  dispatch(loadCfeiStarted());
  return getCfei(project, filters)
    .then((cfei) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiSuccess(cfei.results, project));
    })
    .catch((error) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiFailure(error));
    });
};

const saveCfei = (state, action) => {
  switch (action.project) {
    case OPEN:
      return R.assoc(OPEN, action.cfei, state);
    case PINNED:
      return R.assoc(PINNED, action.cfei, state);
    case DIRECT:
      return R.assoc(DIRECT, action.cfei, state);
    default:
      return state;
  }
};

const cfei = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_SUCCESS: {
      return saveCfei(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ cfei, cfeiStatus });

