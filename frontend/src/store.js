import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import nav from './reducers/nav';
import route from './reducers/route';
import session from './reducers/session';

export default createStore(combineReducers({
  nav,
  route,
  session,
  form: formReducer,
}),
// TODO(marcindo: disable devtools in prod
// eslint-disable-next-line
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
