import R from 'ramda';
import { combineReducers } from 'redux';
import { getOpenCfei, getPinnedCfei, getDirectCfei, getUnsolicitedCN } from '../helpers/api/api';
import { PROJECT_TYPES } from '../helpers/constants';
import { sendRequest } from '../helpers/apiHelper';

import apiMeta, {
  success,
} from './apiMeta';

const messages = {
  loadingCN: 'Couldn\'t load Calls for Expression of ' +
  'Interests, please refresh page and try again',
};

const initialState = {
  open: [],
  pinned: [],
  direct: [],
  unsolicited: [],
};
const CFEI_LIST = 'CFEI_LIST';
const tag = 'cfei';

const getCfeiLoadFunc = (project) => {
  switch (project) {
    case PROJECT_TYPES.OPEN:
    default:
      return getOpenCfei;
    case PROJECT_TYPES.PINNED:
      return getPinnedCfei;
    case PROJECT_TYPES.DIRECT:
      return getDirectCfei;
    case PROJECT_TYPES.UNSOLICITED:
      return getUnsolicitedCN;
  }
};

export const loadCfei = (project, filters) => sendRequest({
  loadFunction: getCfeiLoadFunc(project),
  meta: {
    reducerTag: tag,
    actionTag: CFEI_LIST,
    isPaginated: true,
  },
  successParams: { project },
  errorHandling: { userMessage: messages.loadingCN },
  apiParams: [filters],
});

const extractSector = list => ({
  sector: list[0].category, areas: list.map(area => area.id) });

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
  const cfei = normalizeCfei(action.results);
  const newState = R.assoc(`${action.project}Count`, action.count, state);
  return R.assoc(action.project, cfei, newState);
};

const cfei = (state = initialState, action) => {
  switch (action.type) {
    case success`${CFEI_LIST}`: {
      return saveCfei(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ cfei, status: apiMeta(CFEI_LIST) });

