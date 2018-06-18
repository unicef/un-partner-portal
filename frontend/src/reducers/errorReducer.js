import R from 'ramda';
/**
 * New reducer to handle async errors.
 */


export const NEW_ERROR = 'NEW_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

const permissionDenied = ' - Permission denied.';

const clearError = ({ errorsById, allErrors }, action) => ({
  errorsById: R.dissoc(action.id, errorsById),
  allErrors: R.without([action.id], allErrors),
});
const saveError = ({ errorsById, allErrors }, action) => ({
  errorsById: R.assoc(
    action.id,
    {
      id: action.id,
      userMessage: action.userMessage,
      error: R.path(['error', 'message'], action) || action.error,
      ...action.saveAdditionalErrors,
    },
    errorsById),
  allErrors: R.append(action.id, allErrors),
});

const initialState = {
  allErrors: [],
  errorsById: {},
};

export const errorToBeAdded = (error, id, userMessage) => {
  if (error.response && error.response.status === 403) {
    return ({ type: NEW_ERROR, error, id, userMessage: userMessage + permissionDenied });
  }

  return ({ type: NEW_ERROR, error, id, userMessage });
};
export const errorToBeCleared = id =>
  ({ type: CLEAR_ERROR, id });


export const selectAllErrorsMapped = state => state.allErrors.map(error => state.errorsById[error]);

export default function errrorReducer(state = initialState, action) {
  switch (action.type) {
    case NEW_ERROR: {
      return saveError(state, action);
    }
    case CLEAR_ERROR: {
      return clearError(state, action);
    }
    default:
      return state;
  }
}
