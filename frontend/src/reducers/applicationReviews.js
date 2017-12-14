import { combineReducers } from 'redux';
import R from 'ramda';
import {
  toObject,
  normalizeToId,
  selectIndexWithDefaultNull,
} from './normalizationHelpers';

import { getApplicationReviews, postApplicationReview, putApplicationReview } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, {
  success,
} from './apiMeta';
import { errorToBeAdded } from './errorReducer';

const errorMessage = 'Couldn\'t load reviews for this application, please refresh page and try ' +
'again';
const updateErrorMessage = 'Could save review, please try again';

const APPLICATION_REVIEWS = 'APPLICATION_REVIEWS';
const tag = 'applicationReviews';

const initialState = {
  reviews: {},
  assessments: {},
  reviewers: {},
};

export const loadApplicationReviews = applicationId => sendRequest({
  loadFunction: getApplicationReviews,
  meta: {
    reducerTag: tag,
    actionTag: APPLICATION_REVIEWS,
    isPaginated: false,
  },
  successParams: { applicationId },
  errorHandling: { userMessage: errorMessage },
  apiParams: [applicationId],
});

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
  normalizeReviews(newState, action.applicationId, action.results);
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

export const updateApplicationReview = (applicationId, reviewerId, assessmentId, review) =>
  (dispatch, getState) => {
    const method = isAssesmentAdded(getState().applicationReviews, assessmentId)
      ? putApplicationReview
      : postApplicationReview;
    return method(applicationId, reviewerId, review)
      .then((newReview) => {
        dispatch(loadApplicationReviews(applicationId));
        return newReview;
      }).catch((error) => {
        dispatch(errorToBeAdded(error, 'reviewUpdate', updateErrorMessage));
      });
  };

const applicationReviews = (state = initialState, action) => {
  switch (action.type) {
    case success`${APPLICATION_REVIEWS}`: {
      return saveReviews(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationReviews, status: apiMeta(APPLICATION_REVIEWS) });
