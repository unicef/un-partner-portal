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
    case OPEN:
      return R.assoc(OPEN, cfei, state);
    case PINNED:
      return R.assoc(PINNED, cfei, state);
    case DIRECT:
      return R.assoc(DIRECT, cfei, state);
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

