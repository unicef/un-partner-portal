import { browserHistory as history } from 'react-router';
import R from 'ramda';
import { postRegistration, login } from '../helpers/api/api';

export const SESSION_INIT = 'SESSION_INIT';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

const initialState = {
  role: undefined,
  user: undefined,
  userId: undefined,
  token: undefined,
  userStatus: undefined,
  userLogged: false,
};

export const initSession = session => ({ type: SESSION_INIT, session });

export const loginSuccess = session => ({ type: LOGIN_SUCCESS, session });

export const registerUser = (dispatch, json) => {
  postRegistration(json)
    .then((response) => {
      dispatch(loginSuccess({ role: 'partner', user: response.user.username }));
      history.push('/');
    });
};

export const loginUser = creds => dispatch => login(creds)
  .then((response) => {
    window.localStorage.setItem('token', response.key);
    dispatch(loginSuccess({ user: creds.email, token: response.key }));
    history.push('/');
  });

const setSession = (state, session) => R.mergeDeepRight(state, session);

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return setSession(state, action.session);
    }
    case LOGIN_SUCCESS: {
      return setSession(state, { userLogged: true, ...action.session });
    }
    default:
      return state;
  }
}
