import { combineReducers } from 'redux';
import ApplicationsToScoreStatus, {
  loadApplicationsToScoreStarted,
  loadApplicationsToScoreEnded,
  loadApplicationsToScoreSuccess,
  loadApplicationsToScoreFailure,
  LOAD_APPLICATIONS_TO_SCORE_SUCCESS,
} from './applicationsToScoreStatus';

import { getApplicationsToScore } from '../helpers/api/api';

const initialState = {
  applications: [],
  count: 0,
};

export const loadApplicationsToScore = params => (dispatch) => {
  dispatch(loadApplicationsToScoreStarted());
  return getApplicationsToScore(params)
    .then(({ results, count }) => {
      dispatch(loadApplicationsToScoreEnded());
      dispatch(loadApplicationsToScoreSuccess(results, count));
      return results;
    })
    .catch((error) => {
      dispatch(loadApplicationsToScoreEnded());
      dispatch(loadApplicationsToScoreFailure(error));
    });
};

export const saveApplications = (action) => {
  const { applications, count } = action;
  const newApplications = applications.map(({ eoi: {
    title,
    id,
    deadline_date,
  } }) => ({
    title,
    id,
    deadline_date,
  }));
  return { applications: newApplications, count };
};

const ApplicationsToScore = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_APPLICATIONS_TO_SCORE_SUCCESS: {
      return saveApplications(action);
    }
    default:
      return state;
  }
};

export default combineReducers({ data: ApplicationsToScore, status: ApplicationsToScoreStatus });
