import R from 'ramda';
import { getPartnerFlags } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const OBSERVATIONS_LOAD_STARTED = 'OBSERVATIONS_LOAD_STARTED';
export const OBSERVATIONS_LOAD_SUCCESS = 'OBSERVATIONS_LOAD_SUCCESS';
export const OBSERVATIONS_LOAD_FAILURE = 'OBSERVATIONS_LOAD_FAILURE';
export const OBSERVATIONS_LOAD_ENDED = 'APA_LOAD_ENDED';

export const agencyPartnerObsLoadStarted = () => ({ type: OBSERVATIONS_LOAD_STARTED });
export const agencyPartnerObsLoadSuccess = response => ({ type: OBSERVATIONS_LOAD_SUCCESS, response });
export const agencyPartnerObsLoadFailure = error => ({ type: OBSERVATIONS_LOAD_FAILURE, error });
export const agencyPartnerObsLoadEnded = () => ({ type: OBSERVATIONS_LOAD_ENDED });

const saveFlags = (state, action) => {
  const flags = R.map(item =>
    ({
      flag_type: item.flag_type,
      category_display: item.category_display,
      modified: item.modified,
      submitter: item.submitter,
      contactPerson: item.contact_person,
      contactEmail: item.contact_email,
      contactPhone: item.contact_phone,
      attachment: item.attachment,
    }), action.response.results);

  return R.assoc('items', flags, R.assoc('totalCount', action.response.count, state));
};

const messages = {
  loadFailed: 'Load partner observations failed.',
};

const initialState = {
  columns: [
    { name: 'flag_type', title: 'Type of observation', width: 400 },
    { name: 'category_display', title: 'Category of risk' },
    { name: 'modified', title: 'Date' },
    { name: 'submitter', title: 'Added by' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};

export const loadPartnerFlags = (id, params) => (dispatch) => {
  dispatch(agencyPartnerObsLoadStarted());
  return getPartnerFlags(id, params)
    .then((flags) => {
      dispatch(agencyPartnerObsLoadEnded());
      dispatch(agencyPartnerObsLoadSuccess(flags));
    })
    .catch((error) => {
      dispatch(agencyPartnerObsLoadEnded());
      dispatch(agencyPartnerObsLoadFailure(error));
    });
};

export default function agencyPartnerObservationsListReducer(state = initialState, action) {
  switch (action.type) {
    case OBSERVATIONS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case OBSERVATIONS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case OBSERVATIONS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case OBSERVATIONS_LOAD_SUCCESS: {
      return saveFlags(state, action);
    }
    default:
      return state;
  }
}
