import { combineReducers } from 'redux';
import { deleteClarificationAnswer } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';

export const DELETE_CLARIFICATION_ANSWER = 'DELETE_CLARIFICATION_ANSWER';

const initialState = {
  error: {},
};

export const removeClarificationAnswer = (id, body) => (dispatch) => {
  dispatch(loadStarted(DELETE_CLARIFICATION_ANSWER));
  return deleteClarificationAnswer(id, body)
    .then((user) => {
      dispatch(loadEnded(DELETE_CLARIFICATION_ANSWER));
      dispatch(loadSuccess(DELETE_CLARIFICATION_ANSWER));
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(DELETE_CLARIFICATION_ANSWER));
      dispatch(loadFailure(DELETE_CLARIFICATION_ANSWER, error));
      throw error;
    });
};

function deleteClarificationAnswerReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${DELETE_CLARIFICATION_ANSWER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: deleteClarificationAnswerReducer,
  status: apiMeta(DELETE_CLARIFICATION_ANSWER) });
