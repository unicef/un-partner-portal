import { getCountries } from '../helpers/api/api';

export const LOAD_COUNTRIES_SUCCESS = 'LOAD_COUNTRIES_SUCCESS';

const initialState = {};

const loadCountriesSuccess = countries => ({ type: LOAD_COUNTRIES_SUCCESS, countries });

export const loadCountries = (dispatch) => {
  getCountries()
    .then(countries => dispatch(loadCountriesSuccess(countries)));
};

const saveCountries = action => Object.keys(action.countries).map(key => ({
  value: key,
  label: action.countries[key],
})).sort((a, b) => a.label.localeCompare(b.label));

export default function countriesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_COUNTRIES_SUCCESS: {
      return saveCountries(action);
    }
    default:
      return state;
  }
}
