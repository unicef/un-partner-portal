import { browserHistory as history } from 'react-router';
import R from 'ramda';
import { postRegistration, login, logout, getUserData } from '../helpers/api/api';
import { ROLES, SESSION_STATUS } from '../helpers/constants';

export const SESSION_CHANGE = 'SESSION_CHANGE';
export const SESSION_READY = 'SESSION_READY';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_SUBMITTING = 'LOGIN_SUBMITTIN';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SESSION_ERROR = 'SESSION_ERROR';

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
  newlyRegistered: false,
  hqId: undefined,
};

export const initSession = session => ({ type: SESSION_CHANGE, session });

export const sessionInitializing = () => ({
  type: SESSION_CHANGE,
  session: { state: SESSION_STATUS.CHANGING },
});

export const sessionChange = session => ({
  type: SESSION_CHANGE,
  session: { ...session, state: SESSION_STATUS.READY },
});

export const sessionReady = getState => ({
  type: SESSION_READY,
  session: { state: SESSION_STATUS.READY },
  getState,
});

export const sessionError = error => ({
  type: SESSION_ERROR,
  error,
});

export const loginSuccess = session => ({ type: LOGIN_SUCCESS, session });

export const logoutSuccess = () => ({ type: LOGIN_SUCCESS });

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
      const sessionObject = {
        role,
        name: response.name,
        userId: response.id,
        email: response.email,
        position: response.role,
        // token was valid so we can authorized user
        authorized: true,
        // agency specific field, but ok to have them undefined
        agencyName: response.agency_name,
        agencyId: response.agency_id,
        officeName: response.office_name,
        officeId: response.office_id,
        // partner specific field, but ok to have them undefined
        partners: response.partners,
        hqId: role === ROLES.PARTNER ? R.propOr(null, 'hq_id', R.head(response.partners)) : null,
        partnerCountry: role === ROLES.PARTNER ? R.prop('country_code', R.head(response.partners)) : null,
        partnerId: role === ROLES.PARTNER ? R.prop('id', R.head(response.partners)) : null,
        partnerName: role === ROLES.PARTNER ? R.prop('legal_name', R.head(response.partners)) : null,
        isHq: role === ROLES.PARTNER ? R.prop('is_hq', R.head(response.partners)) : null,
        displayType: role === ROLES.PARTNER ? R.prop('display_type', R.head(response.partners)) : null,
        logo: role === ROLES.PARTNER ? R.prop('logo', R.head(response.partners)) : null,
        logoThumbnail: role === ROLES.PARTNER ? R.prop('org_logo_thumbnail', R.head(response.partners)) : null,
        isProfileComplete: role === ROLES.PARTNER ? R.path(['partner_additional', 'has_finished'],
          R.head(response.partners)) : null,
      };
      dispatch(initSession(sessionObject));
      dispatch(sessionReady(getState));
      return sessionObject;
    })
    .catch((error) => {
      // TODO (marcindo) correct error handling for different scenarios
      history.push('/login');
      dispatch(initSession({
        authorized: false,
        role: ROLES.PARTNER,
        error,
      }));
    });
};

export const loginUser = creds => dispatch => login(creds)
  .then((response) => {
    window.localStorage.setItem('token', response.key);
    dispatch(loginSuccess({ user: creds.email, token: response.key }));
    dispatch(loadUserData());
    history.push('/');
  });

export const logoutUser = () => dispatch => logout()
  .then(() => {
    window.localStorage.removeItem('token');
    dispatch(logoutSuccess());
    history.push('/login');
  }).catch(() => {
    window.localStorage.removeItem('token');
    dispatch(logoutSuccess());
    history.push('/login');
  });

export const registerUser = json => dispatch => postRegistration(json)
  .then(({ user: { email, username } }) => {
    dispatch(loginSuccess({ role: ROLES.PARTNER, user: username }));
    dispatch(sessionChange({ newlyRegistered: true }));
    dispatch(loginUser({ email, password: R.path(['user', 'password'], json) }));
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
    case LOGOUT_SUCCESS: {
      return initialState;
    }
    case SESSION_ERROR: {
      return R.assoc('error', action.error, state);
    }
    default:
      return state;
  }
}
