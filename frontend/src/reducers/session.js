import { browserHistory as history } from 'react-router';
import R from 'ramda';
import { postRegistration, login, getUserData } from '../helpers/api/api';
import { ROLES, SESSION_STATUS } from '../helpers/constants';

export const SESSION_CHANGE = 'SESSION_CHANGE';
export const SESSION_READY = 'SESSION_READY';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_SUBMITTING = 'LOGIN_SUBMITTIN';

const initialState = {
  role: undefined,
  state: SESSION_STATUS.INITIAL,
  authorized: false,
  user: undefined,
  userId: undefined,
  token: undefined,
  userStatus: undefined,
  userLogged: false,
  position: undefined,
  agencyName: undefined,
  agencyId: undefined,
  officeName: undefined,
  officeId: undefined,
  partners: undefined,
  error: undefined,
  email: undefined,
  isHq: undefined,
  displayType: undefined,
};

export const initSession = session => ({ type: SESSION_CHANGE, session });

export const sessionInitializing = () => ({ type: SESSION_CHANGE,
  session: { state: SESSION_STATUS.CHANGING } });

export const sessionChange = session => ({ type: SESSION_CHANGE,
  session: { ...session, state: SESSION_STATUS.READY } });

export const sessionReady = getState => ({ type: SESSION_READY,
  session: { state: SESSION_STATUS.READY },
  getState });

export const loginSuccess = session => ({ type: LOGIN_SUCCESS, session });

export const loadUserData = () => (dispatch, getState) => {
  const token = getState().session.token;
  if (!token) {
    history.push('/login');
    return Promise.resolve();
  }
  dispatch(sessionInitializing());
  return getUserData(token)
    .then((response) => {
      const role = response.agency_name ? ROLES.AGENCY : ROLES.PARTNER;
      window.localStorage.setItem('role', role);
      dispatch(initSession({
        role,
        name: response.name,
        userId: response.id,
        email: response.email,
        // token was valid so we can authorized user
        authorized: true,
        // agency specific field, but ok to have them undefined
        agencyName: response.agency_name,
        agencyId: response.agency_id,
        position: response.role,
        officeName: response.office_name,
        officeId: response.office_id,
        // partner specific field, but ok to have them undefined
        partners: response.partners,
        partnerCountry: role === ROLES.PARTNER ? R.prop('country_code', R.head(response.partners)) : null,
        partnerId: role === ROLES.PARTNER ? R.prop('id', R.head(response.partners)) : null,
        partnerName: role === ROLES.PARTNER ? R.prop('legal_name', R.head(response.partners)) : null,
        isHq: role === ROLES.PARTNER ? R.prop('is_hq', R.head(response.partners)) : null,
        displayType: role === ROLES.PARTNER ? R.prop('display_type', R.head(response.partners)) : null,
      }));
      dispatch(sessionReady(getState));
    })
    .catch((error) => {
      // TODO (marcindo) correct error handling for different scenarios
      if (R.path(['response', 'status'], error) === 401) {
        history.push('/login');
        dispatch(initSession({
          authorized: false,
          role: ROLES.PARTNER,
          error,
        }));
      }
      // just save error somewhere for now
      dispatch(initSession({
        error: error.message,
      }));
      dispatch(sessionReady(getState));
    });
};

export const registerUser = json => (dispatch) => {
  postRegistration(json)
    .then((response) => {
      dispatch(loginSuccess({ role: ROLES.PARTNER, user: response.user.username }));
      history.push('/');
    });
};

export const loginUser = creds => dispatch => login(creds)
  .then((response) => {
    window.localStorage.setItem('token', response.key);
    dispatch(loginSuccess({ user: creds.email, token: response.key }));
    dispatch(loadUserData());
    history.push('/');
  });

const setSession = (state, session) => R.mergeDeepRight(state, session);

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_READY: {
      return setSession(state, action.session);
    }
    case SESSION_CHANGE: {
      return setSession(state, action.session);
    }
    case LOGIN_SUCCESS: {
      return setSession(state, { userLogged: true, ...action.session });
    }
    default:
      return state;
  }
}
