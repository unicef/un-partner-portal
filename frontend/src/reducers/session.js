import { browserHistory as history } from 'react-router';
import { postRegistration } from '../helpers/api/api';

export const SESSION_INIT = 'SESSION_INIT';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

const initialState = {
  role: undefined,
  user: undefined,
  token: undefined,
  userStatus: undefined,
  userLogged: false,
};

export const initSession = session => ({ type: SESSION_INIT, session });
// TODO (marcindo) makes more sense to do separate reducer for it
export const loginSuccess = session => ({ type: LOGIN_SUCCESS, session });

export const registerUser = (dispatch, json) => {
  postRegistration(json)
    .then((response) => {
      dispatch(loginSuccess({ role: 'partner', user: response.user.username }));
      history.push('/');
    });
};
const setSession = (state, session) => ({ ...state, ...session });


export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return setSession(state, action.session);
    }
    case LOGIN_SUCCESS: {
      const newState = { ...state, ...{ userLogged: true } };
      return setSession(newState, action);
    }
    default:
      return state;
  }
}
