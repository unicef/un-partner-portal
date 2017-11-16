/* eslint-disable camelcase */
import { combineReducers } from 'redux';
import R from 'ramda';
import cfeiDetailsStatus, {
  loadCfeiDetailStarted,
  loadCfeiDetailEnded,
  loadCfeiDetailSuccess,
  loadCfeiDetailFailure,
  loadUCNDetailSuccess,
  LOAD_CFEI_DETAIL_SUCCESS,
  LOAD_UCN_DETAIL_SUCCESS,
} from './cfeiDetailsStatus';
import { } from './apiStatus';
import { normalizeSingleCfei } from './cfei';
import { getOpenCfeiDetails, getApplicationDetails } from '../helpers/api/api';

const initialState = {};

export const loadCfei = id => (dispatch) => {
  dispatch(loadCfeiDetailStarted());
  return getOpenCfeiDetails(id)
    .then((cfei) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailSuccess(cfei));
      return cfei;
    })
    .catch((error) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailFailure(error));
    });
};

export const loadUnsolicitedCfei = id => (dispatch) => {
  dispatch(loadCfeiDetailStarted());
  return getApplicationDetails(id)
    .then((cfei) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadUCNDetailSuccess(cfei));
      return cfei;
    })
    .catch((error) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailFailure(error));
    });
};

const mergeCountries = (k, l, r) => {
  if (k === 'adminLevel') {
    if (l.includes(r)) return l;
    return `${l}, ${r}`;
  }
  return l;
};

const mapLocations = R.map(location =>
  ({
    country: location.admin_level_1.country_code,
    adminLevel: location.admin_level_1.name,
  }),
);

const normalizeLocations = R.compose(
  R.map(R.reduce(R.mergeDeepWithKey(mergeCountries), {})),
  R.groupWith(R.eqProps('country')),
  mapLocations,
);

const saveCfei = (state, action) => {
  let cfei = normalizeSingleCfei(action.cfei);
  cfei = R.assoc('locations', normalizeLocations(cfei.locations), cfei);
  return R.assoc(cfei.id, cfei, state);
};

const saveUCN = (state, action) => {
  const { ucn } = action;

  const newUCN = {
    id: ucn.id,
    partner_name: ucn.partner.id,
    display_type: ucn.partner.display_type,
    title: R.path(['proposal_of_eoi_details', 'title'], ucn),
    locations: ucn.locations_proposal_of_eoi,
    specializations: R.path(['proposal_of_eoi_details', 'specializations'], ucn),
    agency: ucn.agency,
    cn: ucn.cn,
    eoiConverted: ucn.eoi_converted,
  };
  return R.assoc(ucn.id, normalizeSingleCfei(newUCN), state);
};

export function selectCfeiDetail(state, id) {
  const { [id]: cfei = null } = state;
  return cfei;
}

export function selectCfeiTitle(state, id) {
  const { [id]: { title = '' } = {} } = state;
  return title;
}

export function selectCfeiStatus(state, id) {
  const { [id]: { status = null } = {} } = state;
  return status;
}

export function selectCfeiConverted(state, id) {
  const { [id]: { eoiConverted = null } = {} } = state;
  return eoiConverted;
}

export function isCfeiCompleted(state, id) {
  const { [id]: { completed_reason = null } = {} } = state;
  return !!completed_reason;
}

export function isCfeiPinned(state, id) {
  const { [id]: { is_pinned = null } = {} } = state;
  return is_pinned;
}

export function selectCfeiCriteria(state, id) {
  const { [id]: { assessments_criteria = [] } = {} } = state;
  return assessments_criteria;
}

export function isUserAReviewer(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.reviewers.includes(userId);
  return false;
}

export function isUserACreator(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.created_by === userId;
  return false;
}

export function isUserAFocalPoint(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.focal_points.includes(userId);
  return false;
}

const cfeiDetails = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CFEI_DETAIL_SUCCESS: {
      return saveCfei(state, action);
    }
    case LOAD_UCN_DETAIL_SUCCESS: {
      return saveUCN(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ cfeiDetails, cfeiDetailsStatus });
