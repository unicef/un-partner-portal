
export const SESSION_INIT = 'SESSION_INIT';

const initialState = {
  role: undefined,
};

export const initSession = session => ({ type: SESSION_INIT, session });

const sessionState = action => ({ role: action.role });

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return sessionState(action.session);
    }
    default:
      return state;
  }
}
