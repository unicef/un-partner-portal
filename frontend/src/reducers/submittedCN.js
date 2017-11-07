import { combineReducers } from 'redux';
import SubmittedCNStatus, {
  loadSubmittedCNStarted,
  loadSubmittedCNEnded,
  loadSubmittedCNSuccess,
  loadSubmittedCNFailure,
  LOAD_SUBMITTED_CN_SUCCESS,
} from './submittedCNStatus';
import { normalizeSingleCfei } from './cfei';

import { getSubmittedCN } from '../helpers/api/api';

const initialState = {
  applications: [],
  count: 0,
};

export const loadSubmittedCN = params => (dispatch) => {
  dispatch(loadSubmittedCNStarted());
  return getSubmittedCN(params)
    .then(({ results, count }) => {
      dispatch(loadSubmittedCNEnded());
      dispatch(loadSubmittedCNSuccess(results, count));
      return results;
    })
    .catch((error) => {
      dispatch(loadSubmittedCNEnded());
      dispatch(loadSubmittedCNFailure(error));
    });
};

export const saveSubmittedCN = (action) => {
  const { cfei, count } = action;
  const newSubmittedCN = cfei.map(normalizeSingleCfei);
  return { submittedCN: newSubmittedCN, count };
};

const SubmittedCN = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SUBMITTED_CN_SUCCESS: {
      return saveSubmittedCN(action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: SubmittedCN, status: SubmittedCNStatus });
