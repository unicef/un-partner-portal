import R from 'ramda';

export const LOAD_COUNTRY_PROFILES = 'LOAD_COUNTRY_PROFILES';
export const SELECT_COUNTRY_ID = 'SELECT_COUNTRY_ID';
export const CREATE_COUNTRY_PROFILE = 'CREATE_COUNTRY_PROFILE';
export const INIT_COUNTRY_ID = -1;

const initialState = {
  countryPresence: [
    { id: 1, name: 'Spain', profile: false },
    { id: 2, name: 'Slovenia', profile: false },
    { id: 3, name: 'Czech Republic', profile: false },
    { id: 4, name: 'Portugal', profile: false },
  ],
  countryProfiles: [
    { id: 5, name: 'Kenya', users: 25, update: '01 Jan 2016', completed: true, profile: true },
    { id: 6, name: 'Syria', users: 1, update: '03 Jan 2017', completed: true, profile: true },
    { id: 7, name: 'Germany', users: 2, update: '1 Dec 2015', completed: false, profile: true },
    { id: 8, name: 'Irland', users: 2, update: '1 Aug 2016', completed: true, profile: true },
    { id: 9, name: 'Ukraine', users: 2, update: '01 Aug 2016', completed: false, profile: true },
    { id: 10, name: 'England', users: 2, update: '1 Aug 2016', completed: false, profile: true },
    { id: 11, name: 'Poland', users: 105, update: '01 Aug 2017', completed: true, profile: true },
  ],
  selectedCountryId: INIT_COUNTRY_ID,
};

export const selectCountryId = countryId => ({ type: SELECT_COUNTRY_ID, countryId });

export const createCountryProfile = () => ({ type: CREATE_COUNTRY_PROFILE });

const setSelectedCountryId = (state, index) => ({ ...state, ...{ selectedCountryId: index } });

const addCountryProfile = (state) => {
  const countryId = state.selectedCountryId;

  let presenceCountry = R.find(R.propEq('id', countryId))(state.countryPresence);
  presenceCountry = R.assoc('profile', true, presenceCountry);
  presenceCountry = R.assoc('completed', false, presenceCountry);

  let stateClone = R.assoc('countryPresence', R.filter(country => country.id !== presenceCountry.id, state.countryPresence), state);
  stateClone = R.assoc('countryProfiles', R.append(presenceCountry, state.countryProfiles), stateClone);

  return stateClone;
};

export default function countryProfiles(state = initialState, action) {
  switch (action.type) {
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
