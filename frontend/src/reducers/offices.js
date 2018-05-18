import { getOffices } from '../helpers/api/api';
import { sessionError } from '../reducers/session';

export const LOAD_OFFICES_SUCCESS = 'LOAD_OFFICES_SUCCESS';

const initialState = {};

const loadOfficesSuccess = offices => ({ type: LOAD_OFFICES_SUCCESS, offices });

export const loadOffices = () => dispatch => getOffices()
  .then(offices => dispatch(loadOfficesSuccess(offices)),
  ).catch((error) => {
    dispatch(sessionError(error));
  });

export default function officesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_OFFICES_SUCCESS: {
      return action.offices;
    }
    default:
      return state;
  }
}
