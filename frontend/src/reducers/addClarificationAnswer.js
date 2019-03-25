import { combineReducers } from 'redux';
import { postClarificationAnswer } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';

export const ADD_CLARIFICATION_ANSWER = 'ADD_CLARIFICATION_ANSWER';

const initialState = {
  error: {},
};

export const addClarificationAnswer = (id, body) => (dispatch) => {
  dispatch(loadStarted(ADD_CLARIFICATION_ANSWER));
  return postClarificationAnswer(id, body)
    .then((user) => {
      dispatch(loadEnded(ADD_CLARIFICATION_ANSWER));
      dispatch(loadSuccess(ADD_CLARIFICATION_ANSWER));
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(ADD_CLARIFICATION_ANSWER));
      dispatch(loadFailure(ADD_CLARIFICATION_ANSWER, error));
      throw error;
    });
};

function addClarificationAnswerReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${ADD_CLARIFICATION_ANSWER}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: addClarificationAnswerReducer,
  status: apiMeta(ADD_CLARIFICATION_ANSWER) });
