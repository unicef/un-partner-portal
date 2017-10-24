import R from 'ramda';
import { getApplicationDirect } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const APPLICATIONS_DIRECT_LOAD_STARTED = 'APPLICATIONS_DIRECT_LOAD_STARTED';
export const APPLICATIONS_DIRECT_LOAD_SUCCESS = 'APPLICATIONS_DIRECT_LOAD_SUCCESS';
export const APPLICATIONS_DIRECT_LOAD_FAILURE = 'APPLICATIONS_DIRECT_LOAD_FAILURE';
export const APPLICATIONS_DIRECT_LOAD_ENDED = 'APPLICATIONS_DIRECT_LOAD_ENDED';

export const applicationsDirectLoadStarted = () => ({ type: APPLICATIONS_DIRECT_LOAD_STARTED });
export const applicationsDirectSuccess = response => ({ type: APPLICATIONS_DIRECT_LOAD_SUCCESS, response });
export const applicationsDirectFailure = error => ({ type: APPLICATIONS_DIRECT_LOAD_FAILURE, error });
export const applicationsDirectEnded = () => ({ type: APPLICATIONS_DIRECT_LOAD_ENDED });


const initialState = {
  columns: [
    { name: 'id', title: 'Concept Note ID' },
    { name: 'project_title', title: 'Project Title', width: 200 },
    { name: 'agency_name', title: 'Agency' },
    { name: 'country', title: 'Country' },
    { name: 'specializations', title: 'Sector' },
    { name: 'submission_date', title: 'Submission Date' },
    { name: 'selected_source', title: 'Direct Selection Source' },
    { name: 'status', title: 'Status' },
  ],
  loading: false,
  direct: [],
  totalCount: 0,
};

const saveApplicationsDirect = (state, action) => {
  const partners = R.assoc('direct', action.response.results, state);
  return R.assoc('totalCount', action.response.count, partners);
};

const messages = {
  loadFailed: 'Load applications failed.',
};

export const loadApplicationsDirect = params => (dispatch) => {
  dispatch(applicationsDirectLoadStarted());
  return getApplicationDirect(params)
    .then((applications) => {
      dispatch(applicationsDirectEnded());
      dispatch(applicationsDirectSuccess(applications));
    })
    .catch((error) => {
      dispatch(applicationsDirectEnded());
      dispatch(applicationsDirectFailure(error));
    });
};

export default function applicationsDirectListReducer(state = initialState, action) {
  switch (action.type) {
    case APPLICATIONS_DIRECT_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case APPLICATIONS_DIRECT_LOAD_ENDED: {
      return stopLoading(state);
    }
    case APPLICATIONS_DIRECT_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case APPLICATIONS_DIRECT_LOAD_SUCCESS: {
      return saveApplicationsDirect(state, action);
    }
    default:
      return state;
  }
}
