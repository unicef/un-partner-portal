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
import {
  loadSuccess,
} from './apiMeta';
import {
  APPLICATION_DETAILS,
} from './applicationDetails';

const initialState = {};

export const loadCfei = id => (dispatch, getState) => {
  dispatch(loadCfeiDetailStarted());
  return getOpenCfeiDetails(id)
    .then((cfei) => {
      dispatch(loadCfeiDetailEnded());
      dispatch(loadCfeiDetailSuccess(cfei));
      if (cfei.direct_selected_partners) {
        cfei.direct_selected_partners.forEach((selectedPartner) => {
          dispatch(loadSuccess(APPLICATION_DETAILS, { results: {
            id: selectedPartner.id,
            application_status: selectedPartner.application_status,
          },
          selectedPartner,
          getState }));
        });
      }
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

const editMapLocations = R.map(location =>
  ({
    country: location.admin_level_1.country_code,
    locations: [location],
  }),
);

const mergeLocations = (k, l, r) =>
  (k === 'locations' ? R.concat(l, r) : r);

const sortLocations = locations => R.sortBy(R.path(['admin_level_1', 'country_code']), locations);


const normalizeLocations = R.compose(
  R.map(R.reduce(R.mergeDeepWithKey(mergeCountries), {})),
  R.groupWith(R.eqProps('country')),
  mapLocations,
  sortLocations,
);

const normalizeEditLocations = R.compose(
  R.map(R.reduce(R.mergeDeepWithKey(mergeLocations), {})),
  R.groupWith(R.eqProps('country')),
  editMapLocations,
  sortLocations,
);

const saveCfei = (state, action) => {
  let cfei = normalizeSingleCfei(action.cfei);
  const cfeiLocations = R.assoc('locations_edit', normalizeEditLocations(cfei.locations), cfei);
  cfei = R.assoc('locations', normalizeLocations(cfei.locations), cfeiLocations);
  
  return R.assoc(cfei.id, cfei, state);
};

const saveUCN = (state, action) => {
  const { ucn } = action;

  const newUCN = {
    id: ucn.id,
    reviewers: [],
    focal_points: [],
    partner_verified: R.path(['partner', 'partner_additional', 'is_verified'], ucn),
    partner_flags: R.path(['partner', 'partner_additional', 'flagging_status'], ucn),
    partner_id: R.path(['partner', 'id'], ucn),
    partner_name: R.path(['partner', 'legal_name'], ucn),
    display_type: R.path(['partner', 'display_type'], ucn),
    title: R.path(['proposal_of_eoi_details', 'title'], ucn),
    locations: normalizeLocations(ucn.locations_proposal_of_eoi),
    locations_edit: normalizeEditLocations(ucn.locations_proposal_of_eoi),
    specializations: R.path(['proposal_of_eoi_details', 'specializations'], ucn),
    agency: R.path(['agency', 'name'], ucn),
    agency_id: R.path(['agency', 'id'], ucn),
    cn: ucn.cn,
    eoiConverted: ucn.eoi_converted,
    status: ucn.application_status,
    displayStatus: ucn.application_status_display,
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

export function selectCfeiAgency(state, id) {
  const { [id]: { agency = 0 } = {} } = state;
  return agency;
}

export function selectCfeiStatus(state, id) {
  const { [id]: { status = null } = {} } = state;
  return status;
}

export function selectCfeiDisplayStatus(state, id) {
  const { [id]: { displayStatus = null } = {} } = state;
  return displayStatus;
}

export function selectCfeiConverted(state, id) {
  const { [id]: { eoiConverted = null } = {} } = state;
  return eoiConverted;
}

export function selectPartnerVerified(state, id) {
  const { [id]: { partner_verified = null } = {} } = state;
  return partner_verified;
}

export function selectPartnerFlagStatus(state, id) {
  const { [id]: { partner_flags = null } = {} } = state;
  return partner_flags;
}

export function selectCfeiCompletedReason(state, id) {
  const { [id]: { completed_reason = null } = {} } = state;
  return completed_reason;
}

export function selectCfeiCompletedReasonDisplay(state, id) {
  const { [id]: { completed_reason_display = null } = {} } = state;
  return completed_reason_display;
}

export function isCfeiCompleted(state, id) {
  const { [id]: { completed_reason = null } = {} } = state;
  return !!completed_reason;
}

export function isUserFinishedReview(state, id) {
  const { [id]: { current_user_finished_reviews = null } = {} } = state;
  return current_user_finished_reviews;
}

export function isUserCompletedAssessment(state, id) {
  const { [id]: { current_user_marked_reviews_completed = null } = {} } = state;
  return current_user_marked_reviews_completed;
}

export function isCfeiDeadlinePassed(state, id) {
  const { [id]: { deadline_passed = null } = {} } = state;
  return deadline_passed;
}

export function isCfeiClarificationDeadlinePassed(state, id) {
  const { [id]: { clarification_request_deadline_passed = null } = {} } = state;
  return clarification_request_deadline_passed;
}

export function isCfeiPublished(state, id) {
  const { [id]: { is_published = null } = {} } = state;
  return is_published;
}

export function isCfeiPinned(state, id) {
  const { [id]: { is_pinned = null } = {} } = state;
  return is_pinned;
}

export function isSendForDecision(state, id) {
  const { [id]: { sent_for_decision = false } = {} } = state;
  return sent_for_decision;
}

export function selectCfeiCriteria(state, id) {
  const { [id]: { assessments_criteria = [] } = {} } = state;
  return assessments_criteria;
}

export function selectCfeiWinnersStatus(state, id) {
  const { [id]: { contains_partner_accepted = false } = {} } = state;
  return contains_partner_accepted;
}

export function isUserAReviewer(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.reviewers.includes(userId);
  return false;
}

export function cfeiDetailsReviewers(state, cfeiId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.reviewers;
  return false;
}

export function cfeiHasRecommendedPartner(state, cfeId) {
  const { [cfeId]: { contains_recommended_applications = false } = {} } = state;
  return contains_recommended_applications;
}

export function cfeiHasPartnerAccepted(state, cfeId) {
  const { [cfeId]: { contains_partner_accepted = false } = {} } = state;
  return contains_partner_accepted;
}

export function isUserACreator(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);
  if (cfei) return cfei.created_by === userId;
  return false;
}

export function isUserAFocalPoint(state, cfeiId, userId) {
  const cfei = R.prop(cfeiId, state);

  if (cfei) {
    return cfei.focal_points.includes(userId);
  }
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

export default combineReducers({ data: cfeiDetails, status: cfeiDetailsStatus });
