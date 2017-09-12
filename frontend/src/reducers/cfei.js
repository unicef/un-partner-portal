import R from 'ramda';
import { combineReducers } from 'redux';
import { getOpenCfei, getPinnedCfei, getDirectCfei } from '../helpers/api/api';
import cfeiStatus, {
  loadCfeiStarted,
  loadCfeiEnded,
  loadCfeiSuccess,
  loadCfeiFailure,
  LOAD_CFEI_SUCCESS } from './cfeiStatus';
import { PROJECT_TYPES } from '../helpers/constants';

const initialState = {
  open: [],
  pinned: [],
  direct: [],
};

const getCfei = (project, filters) => {
  switch (project) {
    case PROJECT_TYPES.OPEN:
    default:
      return getOpenCfei(filters);
    case PROJECT_TYPES.PINNED:
      return getPinnedCfei(filters);
    case PROJECT_TYPES.DIRECT:
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
    case PROJECT_TYPES.OPEN:
      return R.assoc(PROJECT_TYPES.OPEN, action.cfei, state);
    case PROJECT_TYPES.PINNED:
      return R.assoc(PROJECT_TYPES.PINNED, action.cfei, state);
    case PROJECT_TYPES.DIRECT:
      return R.assoc(PROJECT_TYPES.DIRECT, action.cfei, state);
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

