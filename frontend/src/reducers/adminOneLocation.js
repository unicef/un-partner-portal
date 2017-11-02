import R from 'ramda';
import { getAdminOneLocations } from '../helpers/api/api';

const initialState = [];

const LOAD_ADMIN_SUCCESS = 'LOAD_ADMIN_SUCCESS';

const loadAdminOneSuccess = result => ({ type: LOAD_ADMIN_SUCCESS, result });

export const loadAdminOne = code => dispatch => getAdminOneLocations(code)
  .then((result) => {
    dispatch(loadAdminOneSuccess(result.results));
    return result;
  });

const saveAdminLocations = action => R.map(item => R.assoc('label', item.name, R.objOf('value', item.id)), action.result);

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_ADMIN_SUCCESS: {
      return saveAdminLocations(action);
    }
    default:
      return state;
  }
}
