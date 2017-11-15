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

export const loadApplicationFeedback = (applicationId, params, key = 'default') => (dispatch, getState) => {
  dispatch(loadApplicationFeedbackStarted(key));
  return getApplicationFeedback(applicationId, params)
    .then((feedback) => {
      dispatch(loadApplicationFeedbackEnded(key));
      dispatch(loadApplicationFeedbackSuccess(feedback.results, applicationId, feedback.count));
      return feedback;
    })
    .catch((error) => {
      dispatch(loadApplicationFeedbackEnded(key));
      dispatch(loadApplicationFeedbackFailure(error, key));
    });
};

const saveFeedback = (state, action) =>
  R.assoc(action.applicationId, { feedback: action.feedback, count: action.count }, state);

export const selectFeedback = (state, applicationId) => {
  const { feedback = [] } = selectIndexWithDefaultEmptyObject(applicationId, state.data);
  return feedback;
};

export const selectCount = (state, applicationId) => {
  const { count = 0 } = selectIndexWithDefaultEmptyObject(applicationId, state.data);
  return count;
};

export const updateApplicationFeedback = (applicationId, feedback) =>
  (dispatch, getState) => postApplicationFeedback(applicationId, feedback)
    .then((newFeedback) => {
      dispatch(loadApplicationFeedback(applicationId));
      return newFeedback;
    });

const applicationFeedback = (state = initialState, action, params) => {
  switch (action.type) {
    case LOAD_APPLICATION_FEEDBACK_SUCCESS: {
      return saveFeedback(state, action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: applicationFeedback, status: applicationFeedbackStatus });
