
import { getAgencies } from '../helpers/api/api';
import {
  toObject,
  flattenToObjectKey,
  selectIndexWithDefaultNull,
} from './normalizationHelpers';

const initialState = {};
const LOAD_AGENCIES_NAMES_SUCCESS = 'LOAD_AGENCY_NAMES_SUCCESS';

const loadAgenciesNamesSuccess = names => ({ type: LOAD_AGENCIES_NAMES_SUCCESS, names });

export const loadAgenciesNames = () => dispatch => getAgencies()
  .then((names) => {
    dispatch(loadAgenciesNamesSuccess(names.results));
    return names;
  });

export const selectAgenciesName = (state, id) => {
  const agency = selectIndexWithDefaultNull(id, state);
  return agency;
};

const saveAgenciesNames = action =>
  toObject(flattenToObjectKey('name'), action.names);

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_AGENCIES_NAMES_SUCCESS: {
      return saveAgenciesNames(action);
    }
    default:
      return state;
  }
}
