import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';

import cfei from './reducers/cfei';
import cfeiNav from './reducers/cfeiNav';
import nav from './reducers/nav';
import route from './reducers/route';
import session from './reducers/session';
import countries from './reducers/countries';
import countryProfiles from './reducers/countryProfiles';
import partnerProfileEdit from './reducers/partnerProfileEdit';

const mainReducer = combineReducers({
  cfei,
  cfeiNav,
  nav,
  route,
  session,
  countries,
  countryProfiles,
  partnerProfileEdit,
  form: formReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  mainReducer,
  composeEnhancers(
    applyMiddleware(thunk),
  ),
  // TODO(marcindo: disable devtools in prod
  // eslint-disable-next-line
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
