import { combineReducers } from 'redux';
import { postCompleteAssessment } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';

export const COMPLETE_ASSESSMENT = 'COMPLETE_ASSESSMENT';

const initialState = {
  completeAssessmentSubmitting: false,
  completeAssessmentProcessing: false,
  error: {},
};

export const completeAssessmentRequest = id => (dispatch) => {
  dispatch(loadStarted(COMPLETE_ASSESSMENT));
  return postCompleteAssessment(id)
    .then(() => {
      dispatch(loadEnded(COMPLETE_ASSESSMENT));
      dispatch(loadSuccess(COMPLETE_ASSESSMENT));
    })
    .catch((error) => {
      dispatch(loadEnded(COMPLETE_ASSESSMENT));
      dispatch(loadFailure(COMPLETE_ASSESSMENT, error));
      throw error;
    });
};

function completeAssessmentReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${COMPLETE_ASSESSMENT}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: completeAssessmentReducer,
  status: apiMeta(COMPLETE_ASSESSMENT) });