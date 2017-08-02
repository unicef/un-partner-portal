import { createStore, combineReducers } from 'redux';

import nav from './reducers/nav';
import route from './reducers/route';
import session from './reducers/session';

export default createStore(combineReducers({
  nav,
  route,
  session,
}),
// TODO(marcindo: disable devtools in prod
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
