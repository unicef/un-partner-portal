import R from 'ramda';
import { getPartnerOrganizationProfiles } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';


export const PARTNER_PROFILES_LOAD_STARTED = 'PARTNER_PROFILES_LOAD_STARTED';
export const PARTNER_PROFILES_LOAD_SUCCESS = 'PARTNER_PROFILES_LOAD_SUCCESS';
export const PARTNER_PROFILES_LOAD_FAILURE = 'PARTNER_PROFILES_LOAD_FAILURE';
export const PARTNER_PROFILES_LOAD_ENDED = 'PARTNER_PROFILES_LOAD_ENDED';
export const LOAD_COUNTRY_PROFILES = 'LOAD_COUNTRY_PROFILES';

export const SELECT_COUNTRY_ID = 'SELECT_COUNTRY_ID';
export const CREATE_COUNTRY_PROFILE = 'CREATE_COUNTRY_PROFILE';
export const INIT_COUNTRY_ID = -1;

export const partnerProfilesLoadStarted = () => ({ type: PARTNER_PROFILES_LOAD_STARTED });
export const partnerProfilesLoadSuccess = response => ({ type: PARTNER_PROFILES_LOAD_SUCCESS, response });
export const partnerProfilesLoadFailure = error => ({ type: PARTNER_PROFILES_LOAD_FAILURE, error });
export const partnerProfilesLoadEnded = () => ({ type: PARTNER_PROFILES_LOAD_ENDED });

const saveProfiles = (state, action) => R.assoc('hq', action.response, state);

const messages = {
  loadFailed: 'Load partners failed.',
};

const initialState = {
  hq: null,
  selectedCountryId: INIT_COUNTRY_ID,
  loading: false,
};


export const loadPartnerProfiles = partnerId => (dispatch) => {
  dispatch(partnerProfilesLoadStarted());
  return getPartnerOrganizationProfiles(partnerId)
    .then((profiles) => {
      dispatch(partnerProfilesLoadEnded());
      dispatch(partnerProfilesLoadSuccess(profiles));
    })
    .catch((error) => {
      dispatch(partnerProfilesLoadEnded());
      dispatch(partnerProfilesLoadFailure(error));
    });
};

export const selectCountryId = countryId => ({ type: SELECT_COUNTRY_ID, countryId });

export const createCountryProfile = () => ({ type: CREATE_COUNTRY_PROFILE });

const setSelectedCountryId = (state, index) => R.assoc('selectedCountryId', index, state);

const addCountryProfile = (state) => {
  const countryId = state.selectedCountryId;

  let presenceCountry = R.find(R.propEq('id', countryId))(state.countryPresence);
  presenceCountry = R.assoc('profile', true, presenceCountry);
  presenceCountry = R.assoc('completed', false, presenceCountry);
  presenceCountry = R.assoc('update', (new Date()).toString().split(' ').splice(1, 3)
    .join(' '), presenceCountry);

  let stateClone = R.assoc('countryPresence', R.filter(country => country.id !== presenceCountry.id, state.countryPresence), state);
  stateClone = R.assoc('countryProfiles', R.append(presenceCountry, state.countryProfiles), stateClone);

  return stateClone;
};

export default function countryProfilesReducer(state = initialState, action) {
  switch (action.type) {
    case PARTNER_PROFILES_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case PARTNER_PROFILES_LOAD_ENDED: {
      return stopLoading(state);
    }
    case PARTNER_PROFILES_LOAD_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case PARTNER_PROFILES_LOAD_SUCCESS: {
      return saveProfiles(state, action);
    }
    case SELECT_COUNTRY_ID: {
      return setSelectedCountryId(state, action.countryId);
    }
    case CREATE_COUNTRY_PROFILE: {
      return addCountryProfile(state);
    }
    default:
      return state;
  }
}
