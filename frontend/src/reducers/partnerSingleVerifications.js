import { combineReducers } from 'redux';
import R from 'ramda';
import applicationReviewsStatus, {
  loadPartnerVerificationsStarted,
  loadPartnerVerificationsEnded,
  loadPartnerVerificationsSuccess,
  loadPartnerVerificationsFailure,
  LOAD_APPLICATION_REVIEWS_SUCCESS,
} from './partnerVerificationStatus';
import {
  toObject,
  normalizeToId,
  selectIndexWithDefaultNull,
} from './normalizationHelpers';

import { getPartnerVerifications, postPartnerVerifications, } from '../helpers/api/api';

const initialState = {
  verifications: [],
  allPartnerVerifications: {},
  mostRecentVerification: null,
};

const saveVerification

const normalizeVerifications = (state, applicationId, reviews) =>
  R.forEach(
    (item) => {
      const assessmentId = item.assessment[0] ? item.assessment[0].id : null;
      const reviewerId = item.id;
      const newAssessment = toObject(normalizeToId, item.assessment);
      state.assessments = R.merge(state.assessments, newAssessment);
      const reviewer = normalizeToId(R.omit(['assessment'], item));
      state.reviewers = R.merge(state.reviewers, reviewer);
      state.reviews[applicationId] = R.merge(
        state.reviews[applicationId],
        { [reviewerId]: assessmentId },
      );
    }
    , reviews);

const saveVerifications = (state, action) => {
  const verifications = NormalizeVerifications() = 
  normalizeReviews(newState, action.partnerId, action.reviews);
  return newState;
};

export const selectReview = (state, reviewId) =>
  selectIndexWithDefaultNull(reviewId, state.data.reviews);

export const selectReviewer = (state, reviewId) =>
  selectIndexWithDefaultNull(reviewId, state.data.reviewers);

export const selectAssessment = (state, reviewId) =>
  selectIndexWithDefaultNull(reviewId, state.data.assessments);

export const isAssesmentAdded = (state, assessmentId) =>
  R.has(assessmentId, state.data.assessments);

export const updateApplicationReview = (partnerId, body) =>
  (dispatch) => {
    return postPartnerVerifications(partnerId, body)
      .then((newVerification) => {
        dispatch(loadPartnerVerifications(partnerId));
        return newVerification;
      });
  };

const applicationReviews = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATION_REVIEWS_SUCCESS: {
      return saveVerifications(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationReviews, status: applicationReviewsStatus });
