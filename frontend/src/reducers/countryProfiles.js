export const LOAD_COUNTRIES_SUCCESS = 'LOAD_PROFILE_COUNTRIES';

const initialState = {
  countryPresence: [],
  countryProfiles: [],
  selectedCountryId: -1,
};

const loadCountryProfiles = countries => ({ type: LOAD_COUNTRIES_SUCCESS, countries });

export const loadCountries = (dispatch) => {
  getCountries()
    .then(countries => dispatch(loadCountriesSuccess(countries)));
};



export default function countryProfiles(state = initialState, action) {
  switch (action.type) {
    case LOAD_COUNTRY_PROFILES: {
      return loadCountryProfiles(action);
    }
    default:
      return state;
  }
}
