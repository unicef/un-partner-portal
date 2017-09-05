import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reducer as formReducer } from 'redux-form';
import R from 'ramda';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';


import cfei from './reducers/cfei';
import cfeiNav from './reducers/cfeiNav';
import newCfei from './reducers/newCfei';
import nav from './reducers/nav';
import session from './reducers/session';
import countries from './reducers/countries';
import population from './reducers/population';
import partnerProfileEdit from './reducers/partnerProfileEdit';

const middleware = routerMiddleware(browserHistory);

export default createStore(combineReducers({
  cfei,
  cfeiNav,
  newCfei,
  nav,
  session,
  countries,
  population,
  partnerProfileEdit,
  form: formReducer,
  routing: routerReducer,
}),
applyMiddleware(middleware),
// TODO(marcindo: disable devtools in prod
// eslint-disable-next-line
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const mapValuesForSelectionField = (state) => {
  const makeFormItem = list => R.zipObj(['value', 'label'], list);
  const compare = (a, b) => a.label.localeCompare(b.label);
  return R.sort(compare, R.map(makeFormItem, R.toPairs(state)));
};

export const selectNormalizedCountries = state =>
  mapValuesForSelectionField(state.countries);
export const selectNormalizedPopulations = state =>
  mapValuesForSelectionField(state.population);
