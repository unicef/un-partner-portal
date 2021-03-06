import { browserHistory as history } from 'react-router';
import R from 'ramda';
import {
  getUserData,
  login,
  logout,
  postRegistration,
  passwordResetConfirm,
} from '../helpers/api/api';
import { ROLES, SESSION_STATUS } from '../helpers/constants';

export const SESSION_CHANGE = 'SESSION_CHANGE';
export const SESSION_READY = 'SESSION_READY';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_SUBMITTING = 'LOGIN_SUBMITTIN';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SESSION_ERROR = 'SESSION_ERROR';
export const NOTIFICATION_UPDATE = 'NOTIFICATION_UPDATE';

const initialState = {
  role: null,
  state: SESSION_STATUS.INITIAL,
  authorized: false,
  fontSize: '16px',
  user: null,
  userId: null,
  token: null,
  userStatus: null,
  userLogged: false,
  position: null,
  agencyName: null,
  agencyId: null,
  officeName: null,
  officeId: null,
  partners: null,
  error: null,
  email: null,
  isHq: null,
  displayType: null,
  newlyRegistered: false,
  hqId: null,
  partnerCountry: null,
  partnerId: null,
  partnerName: null,
  logo: null,
  logoThumbnail: null,
  isProfileComplete: null,
  lastUpdate: null,
  notificationFrequency: null,
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

export const updateNotification = frequency => ({ type: NOTIFICATION_UPDATE, frequency });

export const loginSuccess = session => ({ type: LOGIN_SUCCESS, session });

export const logoutSuccess = () => ({ type: LOGOUT_SUCCESS });

export const loadUserData = () => (dispatch, getState) => {
  const { session } = getState();
  const token = session.token;
  const partnerId = session.partnerId;

  dispatch(sessionInitializing());
  return getUserData(token)
    .then((response) => {
      const role = response.office_memberships ? ROLES.AGENCY : ROLES.PARTNER;
      window.localStorage.setItem('role', role);
      let sessionObject = {
        role,
        name: response.name,
        userId: response.id,
        email: response.email,
        position: response.role,
        notificationFrequency: R.path(['profile', 'notification_frequency'], response),
        // token was valid so we can authorized user
        authorized: true,
      };
      const addToSession = R.mergeDeepRight(sessionObject);
      // agency specific fields

      if (role === ROLES.AGENCY) {
        const office = R.head(response.office_memberships);
        const agencyObject = {
          officeId: R.prop('office_id', office),
          officeName: R.path(['office', 'name'], office),
          telephone: R.path(['office', 'telephone'], office),
          offices: response.office_memberships,
          officeCountryCode: R.path(['office', 'country'], office),
          officeRole: R.prop('role_display', office),
          agencyName: R.path(['office', 'agency', 'name'], office),
          agencyId: R.path(['office', 'agency', 'id'], office),
          permissions: R.path(['permissions'], office),
        };
        sessionObject = addToSession(agencyObject);
      }
      // partner specific fields
      if (role === ROLES.PARTNER) {
        const mainPartner = R.defaultTo(
          R.find(R.propEq('is_hq', true), response.partners) || R.head(response.partners),
          R.find(R.propEq('id', partnerId), response.partners),
        );

        const partnerObject = {
          partners: response.partners,
          hqId: R.propOr(null, 'hq_id', mainPartner),
          partnerCountry: R.prop('country_code', mainPartner),
          partnerId: R.prop('id', mainPartner),
          partnerName: R.prop('legal_name', mainPartner),
          isHq: R.prop('is_hq', mainPartner),
          displayType: R.prop('display_type', mainPartner),
          telephone: R.path(['office', 'telephone'], mainPartner),
          logo: R.prop('logo', mainPartner),
          permissions: R.prop('permissions', response),
          logoThumbnail: R.prop('org_logo_thumbnail', mainPartner) || R.prop('logo', mainPartner),
          isProfileComplete: R.path(['partner_additional', 'has_finished'],
            mainPartner),
          lastUpdate: R.prop('last_profile_update', mainPartner),
        };
        sessionObject = addToSession(partnerObject);
      }
      dispatch(initSession(sessionObject));
      dispatch(sessionReady(getState));

      return sessionObject;
    })
    .catch((error) => {
      if (error.response.status === 404) {
        history.push('/registration');
      } else {
        window.localStorage.removeItem('token');
        window.location.href = '/landing/';
      }

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

export const logoutUser = () => (dispatch, getState) => {
  const logoutAzure = getState().partnerProfileConfig['active-directory-logout-url'];

  return logout()
    .then(() => {
      window.localStorage.removeItem('token');
      dispatch(logoutSuccess());
      window.location.href = logoutAzure;
    }).catch(() => {
      window.localStorage.removeItem('token');
      dispatch(logoutSuccess());
      window.location.href = logoutAzure;
    })
};

export const registerUser = json => dispatch => postRegistration(json)
  .then(() => {
    dispatch(loginSuccess({ role: ROLES.PARTNER }));
    dispatch(sessionChange({ newlyRegistered: true }));
    dispatch(loadUserData());
    history.push('/');
  });

export const changePassword = payload => () => passwordResetConfirm(payload);

const setSession = (state, session) => {
  return R.mergeDeepRight(state, session);
};

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
    case NOTIFICATION_UPDATE: {
      return R.assoc('notificationFrequency', action.frequency.notification_frequency, state);
    }
    default:
      return state;
  }
}
