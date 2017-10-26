import R from 'ramda';
import { getPartnersList } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const PARTNERS_LOAD_STARTED = 'PARTNERS_LOAD_STARTED';
export const PARTNERS_LOAD_SUCCESS = 'PARTNERS_LOAD_SUCCESS';
export const PARTNERS_LOAD_FAILURE = 'PARTNERS_LOAD_FAILURE';
export const PARTNERS_LOAD_ENDED = 'PARTNERS_LOAD_ENDED';

export const partnersLoadStarted = () => ({ type: PARTNERS_LOAD_STARTED });
export const partnersLoadSuccess = response => ({ type: PARTNERS_LOAD_SUCCESS, response });
export const partnersLoadFailure = error => ({ type: PARTNERS_LOAD_FAILURE, error });
export const partnersLoadEnded = () => ({ type: PARTNERS_LOAD_ENDED });

const savePartners = (state, action) => {
  const partners = R.assoc('partners', action.response.results, state);
  return R.assoc('totalCount', action.response.count, partners);
};

const messages = {
  loadFailed: 'Load partners failed.',
};

const initialState = {
  columns: [
    { name: 'name', title: 'Organization\'s Legal Name' },
    { name: 'acronym', title: 'Acronym', width: 100 },
    { name: 'display_type', title: 'Type of Organization' },
    { name: 'country_code', title: 'Country' },
    { name: 'experience_working', title: 'Experience working with UN' },
  ],
  loading: false,
  totalCount: 0,
  partners: [],
};

export const loadPartnersList = params => (dispatch) => {
  dispatch(partnersLoadStarted());
  return getPartnersList(params)
    .then((cfei) => {
      dispatch(partnersLoadEnded());
      dispatch(partnersLoadSuccess(cfei));
    })
    .catch((error) => {
      dispatch(partnersLoadEnded());
      dispatch(partnersLoadFailure(error));
    });
};

export default function agencyPartnersListReducer(state = initialState, action) {
  switch (action.type) {
    case PARTNERS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case PARTNERS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case PARTNERS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case PARTNERS_LOAD_SUCCESS: {
      return savePartners(state, action);
    }
    default:
      return state;
  }
}
