import { combineReducers } from 'redux';
import R from 'ramda';
import applicationFeedbackStatus, {
  loadApplicationFeedbackStarted,
  loadApplicationFeedbackEnded,
  loadApplicationFeedbackSuccess,
  loadApplicationFeedbackFailure,
  LOAD_APPLICATION_FEEDBACK_SUCCESS,
} from './applicationFeedbackStatus';
import {
  selectIndexWithDefaultEmptyObject,
} from './normalizationHelpers';

import { getApplicationFeedback, postApplicationFeedback } from '../helpers/api/api';

const initialState = {};

export const loadApplicationFeedback = (applicationId, params) => (dispatch, getState) => {
  dispatch(loadApplicationFeedbackStarted());
  return getApplicationFeedback(applicationId, params)
    .then((feedback) => {
      dispatch(loadApplicationFeedbackEnded());
      dispatch(loadApplicationFeedbackSuccess(feedback.results, applicationId, feedback.count));
      return feedback;
    })
    .catch((error) => {
      dispatch(loadApplicationFeedbackEnded());
      dispatch(loadApplicationFeedbackFailure(error));
    });
};

const saveFeedback = (state, action) => {
  const { feedback = [] } = selectIndexWithDefaultEmptyObject(action.applicationId, state);
  const newFeedback = R.concat(feedback, R.difference(action.feedback, feedback));
  return R.assoc(action.applicationId, { feedback: newFeedback, count: action.count }, state);
};

export const selectFeedback = (state, applicationId) => {
  const { feedback = [] } = selectIndexWithDefaultEmptyObject(applicationId, state.data);
  return feedback;
};

export const updateApplicationFeedback = (applicationId, feedback) =>
  (dispatch, getState) => postApplicationFeedback(applicationId, feedback)
    .then((newFeedback) => {
      dispatch(loadApplicationFeedbackSuccess([newFeedback], applicationId));
      return newFeedback;
    });

const applicationFeedback = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATION_FEEDBACK_SUCCESS: {
      return saveFeedback(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationFeedback, status: applicationFeedbackStatus });
