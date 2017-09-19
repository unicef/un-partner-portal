import R from 'ramda';
import { getSectors } from '../helpers/api/api';
import {
  flattenToObjectKey,
  toObject,
  flattenToNames,
  normId,
} from './normalizationHelpers';

export const LOAD_SECTORS_SUCCESS = 'LOAD_SECTORS_SUCCESS';

const initialState = {};

const loadSectorsSuccess = sectors => ({ type: LOAD_SECTORS_SUCCESS, sectors });

export const loadSectors = () => dispatch => getSectors()
  .then(sectors => dispatch(loadSectorsSuccess(sectors)));


const flattenToSpecialization = item => flattenToObjectKey('specializations')(normId('specializations')(item));
const flattenSpecializations = item => toObject(flattenToNames, item.specializations);

const normalizeSectors = sectors => ({
  allSectors: toObject(flattenToNames, sectors),
  bySector: toObject(flattenToSpecialization, sectors),
  allSpecializations: R.mergeAll(R.map(flattenSpecializations, sectors)),
});

export const selectAllSectors = state => state.allSectors;
export const selectSector = (state, id) => state.allSectors[id];
export const selectSpecializations = (state, ids) =>
  R.pick(ids, state.allSpecializations);
export const selectSpecializationsForSector = (state, sectorId) => {
  if (!state.bySector) return {};
  return selectSpecializations(state, state.bySector[sectorId]);
};

export default function sectorsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SECTORS_SUCCESS: {
      return normalizeSectors(action.sectors);
    }
    default:
      return state;
  }
}

