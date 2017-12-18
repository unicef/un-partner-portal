import R from 'ramda';
import { getPartnerOrganizationProfiles, createCountryProfile } from '../helpers/api/api';
import { sessionChange } from './session';
import {
  clearError,
  startLoadingField,
  stopLoadingField,
  saveErrorMsg,
} from './apiStatus';
import { errorToBeAdded } from './errorReducer';

export const CREATE_PROFILE_LOAD_STARTED = 'CREATE_PROFILE_LOAD_STARTED';
export const CREATE_PROFILE_LOAD_SUCCESS = 'CREATE_PROFILE_LOAD_SUCCESS';
export const CREATE_PROFILE_LOAD_FAILURE = 'CREATE_PROFILELOAD_FAILURE';
export const CREATE_PROFILE_LOAD_ENDED = 'CREATE_PROFILE_LOAD_ENDED';

export const PARTNER_PROFILES_LOAD_STARTED = 'PARTNER_PROFILES_LOAD_STARTED';
export const PARTNER_PROFILES_LOAD_SUCCESS = 'PARTNER_PROFILES_LOAD_SUCCESS';
export const PARTNER_PROFILES_LOAD_FAILURE = 'PARTNER_PROFILES_LOAD_FAILURE';
export const PARTNER_PROFILES_LOAD_ENDED = 'PARTNER_PROFILES_LOAD_ENDED';

export const SELECT_COUNTRY_ID = 'SELECT_COUNTRY_ID';
export const CREATE_COUNTRY_PROFILE = 'CREATE_COUNTRY_PROFILE';
export const INIT_COUNTRY_ID = -1;

export const createProfileLoadStarted = () => ({ type: CREATE_PROFILE_LOAD_STARTED });
export const createProfileLoadSuccess = (response) => ({ type: CREATE_PROFILE_LOAD_SUCCESS, response });
export const createProfileLoadFailure = error => ({ type: CREATE_PROFILE_LOAD_FAILURE, error });
export const createProfileLoadEnded = () => ({ type: CREATE_PROFILE_LOAD_ENDED });

export const partnerProfilesLoadStarted = () => ({ type: PARTNER_PROFILES_LOAD_STARTED });
export const partnerProfilesLoadSuccess = response => ({ type: PARTNER_PROFILES_LOAD_SUCCESS, response });
export const partnerProfilesLoadFailure = error => ({ type: PARTNER_PROFILES_LOAD_FAILURE, error });
export const partnerProfilesLoadEnded = () => ({ type: PARTNER_PROFILES_LOAD_ENDED });

const saveProfiles = (state, action) => R.assoc('hq', action.response, state);


const messages = {
  loadFailed: 'Load partners failed.',
  loadingPartnersField: 'loading',
  loadingCreateProfile: 'createLoading',
  creationFailed: 'Unable to create country profile, please try again',
};

const initialState = {
  hq: null,
  selectedCountryId: INIT_COUNTRY_ID,
  loading: false,
  createLoading: false,
};

export const loadPartnerProfiles = (partnerId, addToSession) => (dispatch, getState) => {
  const session = getState().session;

  dispatch(partnerProfilesLoadStarted());
  return getPartnerOrganizationProfiles(partnerId)
    .then((profiles) => {
      dispatch(partnerProfilesLoadEnded());
      dispatch(partnerProfilesLoadSuccess(profiles));

      if (addToSession) {
        const partners = R.unionWith(R.eqBy(R.prop('id')), session.partners, profiles.country_profiles);
        dispatch(sessionChange(R.assoc('partners', partners, session)));
      }
    })
    .catch((error) => {
      dispatch(partnerProfilesLoadEnded());
      dispatch(partnerProfilesLoadFailure(error));
    });
};

export const newCountryProfile = partnerId => (dispatch, getState) => {
  dispatch(createProfileLoadStarted());
  const data = { chosen_country_to_create: [getState().countryProfiles.selectedCountryId] };

  return createCountryProfile(partnerId, data)
    .then((response) => {
      dispatch(createProfileLoadEnded());
      dispatch(createProfileLoadSuccess(response));
    })
    .catch((error) => {
      dispatch(createProfileLoadEnded());
      dispatch(createProfileLoadFailure(error));
      dispatch(errorToBeAdded(error, 'newCountryProfile', messages.creationFailed));
    });
};

export const createCountryAndRefresh = partnerId => dispatch =>
  dispatch(newCountryProfile(partnerId)).then(() => dispatch(loadPartnerProfiles(partnerId, true)));


export const selectCountryId = countryId => ({ type: SELECT_COUNTRY_ID, countryId });

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
    case CREATE_PROFILE_LOAD_FAILURE:
    case PARTNER_PROFILES_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case PARTNER_PROFILES_LOAD_ENDED: {
      return stopLoadingField(state, messages.loadingPartnersField);
    }
    case PARTNER_PROFILES_LOAD_STARTED: {
      clearError(state);
      return startLoadingField(state, messages.loadingPartnersField);
    }
    case CREATE_PROFILE_LOAD_STARTED: {
      clearError(state);
      return startLoadingField(state, messages.loadingCreateProfile);
    }
    case CREATE_PROFILE_LOAD_ENDED: {
      clearError(state);
      return stopLoadingField(state, messages.loadingCreateProfile);
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
