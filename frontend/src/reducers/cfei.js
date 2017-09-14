import R from 'ramda';
import { combineReducers } from 'redux';
import { getOpenCfei, getPinnedCfei, getDirectCfei } from '../helpers/api/api';
import cfeiStatus, {
  loadCfeiStarted,
  loadCfeiEnded,
  loadCfeiSuccess,
  loadCfeiFailure,
  LOAD_CFEI_SUCCESS,
} from './cfeiStatus';
import { selectSector } from '../store';
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

export const loadCfei = (project, filters) => (dispatch, getState) => {
  dispatch(loadCfeiStarted());
  return getCfei(project, filters)
    .then((cfei) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiSuccess(cfei.results, project, getState));
    })
    .catch((error) => {
      dispatch(loadCfeiEnded());
      dispatch(loadCfeiFailure(error));
    });
};

const extractSector = list => ({ name: list[0].category, specializations: list });
const groupSpecializationsByCategory = () =>
  R.compose(R.map(extractSector), R.groupWith(R.eqProps('category')));


const normalizeCfei = (cfeis, getState) =>
  R.map(cfei =>
    R.assoc(
      'specializations',
      R.compose(
        R.map(spec => R.assoc('name', selectSector(getState(), spec.name), spec)),
        groupSpecializationsByCategory(),
      )(cfei.specializations),
      cfei,
    ), cfeis,
  );

const saveCfei = (state, action) => {
  const cfei = normalizeCfei(action.cfei, action.getState);
  switch (action.project) {
    case PROJECT_TYPES.OPEN:
      return R.assoc(PROJECT_TYPES.OPEN, cfei, state);
    case PROJECT_TYPES.PINNED:
      return R.assoc(PROJECT_TYPES.PINNED, cfei, state);
    case PROJECT_TYPES.DIRECT:
      return R.assoc(PROJECT_TYPES.DIRECT, cfei, state);
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

