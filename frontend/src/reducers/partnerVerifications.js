import { combineReducers } from 'redux';
import R from 'ramda';
import applicationReviewsStatus, {
  loadPartnerVerificationsStarted,
  loadPartnerVerificationsEnded,
  loadPartnerVerificationsSuccess,
  loadPartnerVerificationsFailure,
  LOAD_PARTNER_VERIFICATIONS_SUCCESS,
} from './partnerVerificationStatus';
import {
  selectIndexWithDefaultNull,
} from './normalizationHelpers';

import { getPartnerVerifications, postPartnerVerifications } from '../helpers/api/api';

const initialState = {
};

const SINGLE_VERIFICATION_ADDED = 'SINGLE_VERIFICATION_ADDED';
const addSingleVerification = (partnerId, verification) =>
  ({ type: SINGLE_VERIFICATION_ADDED, partnerId, verification });

export const loadPartnerVerifications = id => (dispatch) => {
  dispatch(loadPartnerVerificationsStarted());
  return getPartnerVerifications(id)
    .then((response) => {
      dispatch(loadPartnerVerificationsEnded());
      dispatch(loadPartnerVerificationsSuccess(response.results, id));
    })
    .catch((error) => {
      dispatch(loadPartnerVerificationsEnded());
      dispatch(loadPartnerVerificationsFailure(error));
    });
};

const normalizeVerification = result => R.assoc('submitter', result.submitter.id, result);
const saveVerifications = (state, action) => {
  const verifications = R.map(normalizeVerification(action.verifications));
  const mostRecentVerification = R.clone(R.head(verifications));
  return R.assoc(action.partnerId, { mostRecentVerification, verifications }, state);
};

const saveSingleVerification = () => {
  debugger
}

export const selectReview = (state, reviewId) =>
  selectIndexWithDefaultNull(reviewId, state.data.reviews);

export const selectReviewer = (state, reviewId) =>
  selectIndexWithDefaultNull(reviewId, state.data.reviewers);

export const selectAssessment = (state, reviewId) =>
  selectIndexWithDefaultNull(reviewId, state.data.assessments);

export const isAssesmentAdded = (state, assessmentId) =>
  R.has(assessmentId, state.data.assessments);

export const updateApplicationReview = (partnerId, body) =>
  dispatch => postPartnerVerifications(partnerId, body)
    .then((newVerification) => {
      dispatch(addSingleVerification(partnerId, newVerification));
      return newVerification;
    });

const applicationReviews = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_PARTNER_VERIFICATIONS_SUCCESS: {
      return saveVerifications(state, action);
    }
    case SINGLE_VERIFICATION_ADDED: {
      return saveSingleVerification(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationReviews, status: applicationReviewsStatus });

