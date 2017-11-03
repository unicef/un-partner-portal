import R from 'ramda';
import { normalizeSingleCfei } from './cfei';
import { getPartnerApplications } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const APA_LOAD_STARTED = 'APA_LOAD_STARTED';
export const APA_LOAD_SUCCESS = 'APA_LOAD_SUCCESS';
export const APA_LOAD_FAILURE = 'APA_LOAD_FAILURE';
export const APA_LOAD_ENDED = 'APA_LOAD_ENDED';

export const agencyPartnerAppLoadStarted = () => ({ type: APA_LOAD_STARTED });
export const agencyPartnerAppLoadSuccess = response => ({ type: APA_LOAD_SUCCESS, response });
export const agencyPartnerAppLoadFailure = error => ({ type: APA_LOAD_FAILURE, error });
export const agencyPartnerAppLoadEnded = () => ({ type: APA_LOAD_ENDED });

const saveMembers = (state, action) => {
  const applications = R.map(item =>
    ({
      id: item.id,
      cfei_type: item.cfei_type,
      did_win: item.did_win,
      created: item.created,
      title: R.path(['eoi', 'title'], item),
      country_code: R.path(['eoi', 'country_code'], item),
      specializations: R.path(['eoi', 'specializations'], item) ? normalizeSingleCfei(item.eoi).specializations : [],
      name: R.path(['eoi', 'agency', 'name'], item),
      eoi_id: R.path(['eoi', 'id'], item),
    }), action.response.results);

  return R.assoc('items', applications, R.assoc('totalCount', action.response.count, state));
};

const messages = {
  loadFailed: 'Load members failed.',
};

const initialState = {
  columns: [
    { name: 'title', title: 'Project name' },
    { name: 'id', title: 'CN ID' },
    { name: 'cfei_type', title: 'Type of Application' },
    { name: 'name', title: 'Agency' },
    { name: 'country_code', title: 'Country' },
    { name: 'specializations', title: 'Sector' },
    { name: 'created', title: 'Submission/Received date' },
    { name: 'did_win', title: 'Awarded' },
  ],
  loading: false,
  totalCount: 0,
  items: [],
};

export const loadPartnerApplications = params => (dispatch) => {
  dispatch(agencyPartnerAppLoadStarted());
  return getPartnerApplications(params)
    .then((applications) => {
      dispatch(agencyPartnerAppLoadEnded());
      dispatch(agencyPartnerAppLoadSuccess(applications));
    })
    .catch((error) => {
      dispatch(agencyPartnerAppLoadEnded());
      dispatch(agencyPartnerAppLoadFailure(error));
    });
};

export default function agencyPartnerApplicationsListReducer(state = initialState, action) {
  switch (action.type) {
    case APA_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case APA_LOAD_ENDED: {
      return stopLoading(state);
    }
    case APA_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case APA_LOAD_SUCCESS: {
      return saveMembers(state, action);
    }
    default:
      return state;
  }
}
