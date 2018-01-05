import R from 'ramda';
import { normalizeSingleCfei } from './cfei';
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
    { name: 'id', title: 'Application ID' },
    { name: 'project_title', title: 'Project Title', width: 200 },
    { name: 'agency_name', title: 'UN Agency' },
    { name: 'country', title: 'Country' },
    { name: 'specializations', title: 'Sector' },
    { name: 'submission_date', title: 'Submission Date' },
    { name: 'selected_source', title: 'Direct Selection Source' },
    { name: 'status', title: 'Status' },
  ],
  loading: false,
  items: [],
  totalCount: 0,
};

const saveApplicationsDirect = (state, action) => {
  const applications = R.map(item =>
    ({
      id: item.id,
      project_title: item.project_title,
      agency_name: item.agency_name,
      country: item.country,
      specializations: R.path(['specializations'], item) ? normalizeSingleCfei(item).specializations : [],
      submission_date: item.submission_date,
      selected_source: item.selected_source,
      status: item.status,
      application_status: item.application_status,
      eoi_id: item.eoi_id,
    }), action.response.results);

  return R.assoc('items', applications, R.assoc('totalCount', action.response.count, state));
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
