import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import cfeiNav from './reducers/cfeiNav';
import nav from './reducers/nav';
import route from './reducers/route';
import session from './reducers/session';
import countries from './reducers/countries';
import countryProfiles from './reducers/countryProfiles';
import partnerProfileEdit from './reducers/partnerProfileEdit';

export default createStore(combineReducers({
  cfeiNav,
  nav,
  route,
  session,
  countries,
  countryProfiles,
  partnerProfileEdit,
  form: formReducer,
}),
// TODO(marcindo: disable devtools in prod
// eslint-disable-next-line
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
