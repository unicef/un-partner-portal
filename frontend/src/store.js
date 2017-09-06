
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import R from 'ramda';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import cfei from './reducers/cfei';
import cfeiNav from './reducers/cfeiNav';
import newCfei from './reducers/newCfei';
import nav from './reducers/nav';
import session from './reducers/session';
import countries from './reducers/countries';
import countryProfiles from './reducers/countryProfiles';
import partnerProfileEdit from './reducers/partnerProfileEdit';
import agencyPartnersList from './reducers/agencyPartnersList';
import population from './reducers/population';
import hqProfileNav from './reducers/hqProfileNav';


const mainReducer = combineReducers({
  cfei,
  cfeiNav,
  newCfei,
  hqProfileNav,
  nav,
  session,
  countries,
  countryProfiles,
  partnerProfileEdit,
  agencyPartnersList,
  form: formReducer,
  population,
  routing: routerReducer,
});

const middelware = [thunk, routerMiddleware(browserHistory)];
// TODO(marcindo: disable devtools in prod
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  mainReducer,
  composeEnhancers(
    applyMiddleware(...middelware),
  ),
);

const mapValuesForSelectionField = (state) => {
  const makeFormItem = list => R.zipObj(['value', 'label'], list);
  const compare = (a, b) => a.label.localeCompare(b.label);
  return R.sort(compare, R.map(makeFormItem, R.toPairs(state)));
};

export const selectNormalizedCountries = state =>
  mapValuesForSelectionField(state.countries);
export const selectNormalizedPopulations = state =>
  mapValuesForSelectionField(state.population);

