import { combineReducers } from 'redux';
import { postClarificationRequest } from '../helpers/api/api';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';

export const ADD_CLARIFICATION_REQUEST = 'ADD_CLARIFICATION_REQUEST';

const initialState = {
  error: {},
};

export const addClarificationRequest = (id, body) => (dispatch) => {
  dispatch(loadStarted(ADD_CLARIFICATION_REQUEST));
  return postClarificationRequest(id, body)
    .then((user) => {
      dispatch(loadEnded(ADD_CLARIFICATION_REQUEST));
      dispatch(loadSuccess(ADD_CLARIFICATION_REQUEST));
      return user;
    })
    .catch((error) => {
      dispatch(loadEnded(ADD_CLARIFICATION_REQUEST));
      dispatch(loadFailure(ADD_CLARIFICATION_REQUEST, error));
      throw error;
    });
};

function addClarificationRequestReducer(state = initialState, action) {
  switch (action && action.type) {
    case success`${ADD_CLARIFICATION_REQUEST}`: {
      return state;
    }
    default:
      return state;
  }
}

export default combineReducers({ data: addClarificationRequestReducer,
  status: apiMeta(ADD_CLARIFICATION_REQUEST) });
