import R from 'ramda';
import { normalizeSingleCfei } from './cfei';
import { getApplicationUnsolicitedConceptNotes } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const APPLICATIONS_UCN_LOAD_STARTED = 'APPLICATIONS_UCN_LOAD_STARTED';
export const APPLICATIONS_UCN_LOAD_SUCCESS = 'APPLICATIONS_UCN_LOAD_SUCCESS';
export const APPLICATIONS_UCN_LOAD_FAILURE = 'APPLICATIONS_UCN_LOAD_FAILURE';
export const APPLICATIONS_UCN_LOAD_ENDED = 'APPLICATIONS_UCN_LOAD_ENDED';

export const applicationsUcnLoadStarted = () => ({ type: APPLICATIONS_UCN_LOAD_STARTED });
export const applicationsUcnSuccess = response => ({ type: APPLICATIONS_UCN_LOAD_SUCCESS, response });
export const applicationsUcnFailure = error => ({ type: APPLICATIONS_UCN_LOAD_FAILURE, error });
export const applicationsUcnEnded = () => ({ type: APPLICATIONS_UCN_LOAD_ENDED });


const initialState = {
  columns: [
    { name: 'id', title: 'Application ID' },
    { name: 'project_title', title: 'Project Title', width: 200 },
    { name: 'agency_name', title: 'UN Agency' },
    { name: 'country', title: 'Country' },
    { name: 'specializations', title: 'Sector' },
    { name: 'submission_date', title: 'Submission Date' },
    { name: 'is_direct', title: 'Chosen for DS/R' },
    { name: 'application_status', title: 'Application status', width: 220 },
  ],
  loading: false,
  items: [],
  totalCount: 0,
};

const saveApplicationsUcn = (state, action) => {
  const applications = R.map(item =>
    ({
      id: item.id,
      project_title: item.project_title,
      agency_name: item.agency_name,
      country: item.country,
      title: R.path(['eoi', 'title'], item),
      specializations: R.path(['specializations'], item) ? normalizeSingleCfei(item).specializations : [],
      submission_date: item.submission_date ? item.submission_date : '-',
      is_direct: item.is_direct,
      application_status: item.application_status,
    }), action.response.results);

  return R.assoc('items', applications, R.assoc('totalCount', action.response.count, state));
};

const messages = {
  loadFailed: 'Load applications failed.',
};

export const loadApplicationsUcn = params => (dispatch) => {
  dispatch(applicationsUcnLoadStarted());
  return getApplicationUnsolicitedConceptNotes(params)
    .then((applications) => {
      dispatch(applicationsUcnEnded());
      dispatch(applicationsUcnSuccess(applications));
    })
    .catch((error) => {
      dispatch(applicationsUcnEnded());
      dispatch(applicationsUcnFailure(error));
    });
};

export default function applicationsUnsolicitedListReducer(state = initialState, action) {
  switch (action.type) {
    case APPLICATIONS_UCN_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case APPLICATIONS_UCN_LOAD_ENDED: {
      return stopLoading(state);
    }
    case APPLICATIONS_UCN_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case APPLICATIONS_UCN_LOAD_SUCCESS: {
      return saveApplicationsUcn(state, action);
    }
    default:
      return state;
  }
}
