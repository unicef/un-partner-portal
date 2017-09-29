import R from 'ramda';
import { getPartnerNames } from '../helpers/api/api';
import {
  toObject,
  flattenToObjectKey,
} from './normalizationHelpers';

const initialState = null;
const LOAD_PATNER_NAMES_SUCCESS = 'LOAD_PATNER_NAMES_SUCCESS';

const loadPartnerNamesSuccess = names => ({ type: LOAD_PATNER_NAMES_SUCCESS, names });

export const loadPartnerNames = () => dispatch => getPartnerNames()
  .then((names) => {
    dispatch(loadPartnerNamesSuccess(names));
  });

const savePartnerNames = action => toObject(flattenToObjectKey('legal_name'), action.names);

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_PATNER_NAMES_SUCCESS: {
      return savePartnerNames(action);
    }
    default:
      return state;
  }
}
