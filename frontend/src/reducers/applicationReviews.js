import { combineReducers } from 'redux';
import R from 'ramda';
import applicationReviewsStatus, {
  loadApplicationReviewsStarted,
  loadApplicationReviewsEnded,
  loadApplicationReviewsSuccess,
  loadApplicationReviewsFailure,
  LOAD_APPLICATION_REVIEWS_SUCCESS,
} from './applicationReviewsStatus';
import { toObject,
  normalizeToId,
  selectIndexWithDefaultNull } from './normalizationHelpers';

import { getApplicationReviews } from '../helpers/api/api';

const initialState = {
  reviews: {},
  assessments: {},
  reviewers: {},
};

export const loadApplicationReviews = id => (dispatch, getState) => {
  dispatch(loadApplicationReviewsStarted());
  return getApplicationReviews(id)
    .then((reviews) => {
      dispatch(loadApplicationReviewsEnded());
      dispatch(loadApplicationReviewsSuccess(reviews, id));
      return reviews;
    })
    .catch((error) => {
      dispatch(loadApplicationReviewsEnded());
      dispatch(loadApplicationReviewsFailure(error));
    });
};

const normalizeReviews = (state, applicationId, reviews) =>
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

const saveReviews = (state, action) => {
  const newState = R.clone(state);
  normalizeReviews(newState, action.applicationId, action.reviews);
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

const applicationReviews = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATION_REVIEWS_SUCCESS: {
      return saveReviews(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationReviews, status: applicationReviewsStatus });
