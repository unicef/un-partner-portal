/* eslint-disable camelcase */
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
      return cfei;
    })
    .catch((error) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailFailure(error));
    });
};

const saveCfei = (state, action) => {
  let cfei = normalizeSingleCfei(action.cfei);
  if (cfei.reviewers) cfei = R.assoc('reviewers', cfei.reviewers.map(String), cfei);
  if (cfei.focal_points) cfei = R.assoc('focal_points', cfei.focal_points.map(String), cfei);
  return R.assoc(cfei.id, cfei, state);
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
  if (cfei) return cfei.reviewers.includes(String(userId));
  return false;
}

export function isUserAFocalPoint(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.focal_points.includes(String(userId));
  return false;
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
