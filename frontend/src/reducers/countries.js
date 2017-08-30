import { getCountries } from '../helpers/api/api';

export const LOAD_COUNTRIES_SUCCESS = 'LOAD_COUNTRIES_SUCCESS';

const initialState = [];

const loadCountriesSuccess = countries => ({ type: LOAD_COUNTRIES_SUCCESS, countries });

export const loadCountries = (dispatch) => {
  if (!window.localStorage.countries) {
    return getCountries()
      .then((countries) => {
        window.localStorage.setItem('countries', JSON.stringify(countries));
        return dispatch(loadCountriesSuccess(countries));
      });
  }
  return dispatch(loadCountriesSuccess(JSON.parse(window.localStorage.countries)));
};

export default function countriesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_COUNTRIES_SUCCESS: {
      return action.countries;
    }
    default:
      return state;
  }
}
