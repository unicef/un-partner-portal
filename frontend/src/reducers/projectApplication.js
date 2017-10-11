import R from 'ramda';
import { getProjectApplication } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const PROJECT_APP_LOAD_STARTED = 'PROJECT_APP_LOAD_STARTED';
export const PROJECT_APP_LOAD_SUCCESS = 'PROJECT_APP_LOAD_SUCCESS';
export const PROJECT_APP_LOAD_FAILURE = 'PROJECT_APP_LOAD_FAILURE';
export const PROJECT_APP_LOAD_ENDED = 'PROJECT_APP_LOAD_ENDED';

export const projectAppLoadStarted = () => ({ type: PROJECT_APP_LOAD_STARTED });
export const projectAppLoadSuccess = response => ({ type: PROJECT_APP_LOAD_SUCCESS, response });
export const projectAppLoadFailure = error => ({ type: PROJECT_APP_LOAD_FAILURE, error });
export const projectAppLoadEnded = () => ({ type: PROJECT_APP_LOAD_ENDED });

const saveApplication = (state, action) => R.assoc('app', action.response, state);

const initialState = {
  loading: false,
  app: null,
};

export const projectApplicationExists = partnerId => (dispatch) => {
  dispatch(projectAppLoadStarted());
  
  return getProjectApplication(partnerId)
    .then((profiles) => {
      dispatch(projectAppLoadEnded());
      dispatch(projectAppLoadSuccess(profiles));
    })
    .catch((error) => {
      dispatch(projectAppLoadEnded());
      dispatch(projectAppLoadFailure(error));
    });
};

export default function countryProfilesReducer(state = initialState, action) {
  switch (action.type) {
    case PROJECT_APP_LOAD_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case PROJECT_APP_LOAD_ENDED: {
      return stopLoading(state);
    }
    case PROJECT_APP_LOAD_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case PROJECT_APP_LOAD_SUCCESS: {
      return saveApplication(state, action);
    }
    default:
      return state;
  }
}
