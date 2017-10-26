import R from 'ramda';
import { combineReducers } from 'redux';
import { getOpenCfei, getPinnedCfei, getDirectCfei, getUnsolicitedCN } from '../helpers/api/api';
import cfeiStatus, {
  loadCfeiStarted,
  loadCfeiEnded,
  loadCfeiSuccess,
  loadCfeiFailure,
  LOAD_CFEI_SUCCESS,
} from './cfeiStatus';
import { PROJECT_TYPES } from '../helpers/constants';

const initialState = {
  open: [],
  pinned: [],
  direct: [],
  unsolicited: [],
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
    case PROJECT_TYPES.UNSOLICITED:
      return getUnsolicitedCN(filters);
  }
};

export const loadCfei = (project, filters) => (dispatch) => {
  dispatch(loadCfeiStarted());
  return getCfei(project, filters)
    .then((cfei) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiSuccess(cfei.results, project, cfei.count));
    })
    .catch((error) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiFailure(error));
    });
};

const extractSector = list => ({
  sector: list[0].category.toString(), areas: list.map(area => area.id.toString()) });

const groupSpecializationsByCategory = () =>
  R.compose(R.map(extractSector), R.groupWith(R.eqProps('category')));

export const normalizeSingleCfei = cfei => R.assoc(
  'specializations',
  R.compose(
    groupSpecializationsByCategory(),
  )(cfei.specializations),
  cfei);


const normalizeCfei = cfeis =>
  R.map(
    normalizeSingleCfei, cfeis,
  );

const saveCfei = (state, action) => {
  const cfei = (action.project === PROJECT_TYPES.UNSOLICITED)
    ? action.cfei
    : normalizeCfei(action.cfei, action.getState);
  const newState = R.assoc(`${action.project}Count`, action.count, state);
  return R.assoc(action.project, cfei, newState);
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

