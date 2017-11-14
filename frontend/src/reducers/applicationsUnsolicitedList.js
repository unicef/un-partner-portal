import R from 'ramda';
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
    { name: 'is_direct', title: 'Chosen for direct selection' },
  ],
  loading: false,
  unsolicited: [],
  totalCount: 0,
};

const saveApplicationsUcn = (state, action) => {
  const partners = R.assoc('unsolicited', action.response.results, state);
  return R.assoc('totalCount', action.response.count, partners);
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
