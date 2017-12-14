import R from 'ramda';
import { getCountries } from '../helpers/api/api';

export const LOAD_COUNTRIES_SUCCESS = 'LOAD_COUNTRIES_SUCCESS';

const initialState = {};

const loadCountriesSuccess = countries => ({ type: LOAD_COUNTRIES_SUCCESS, countries });

// TODO: think of better way to handle countries, not just download them everytime
export const loadCountries = () => dispatch => getCountries()
  .then((countries) => {
    window.localStorage.setItem('countries', JSON.stringify(countries));
    return dispatch(loadCountriesSuccess(countries));
  });

export default function countriesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_COUNTRIES_SUCCESS: {
      return action.countries;
    }
    default:
      return state;
  }
}
