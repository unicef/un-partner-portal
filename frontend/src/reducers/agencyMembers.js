import { getAgencyMembers } from '../helpers/api/api';
import R from 'ramda';
import { extractIds, flattenToId, toObject, flattenToObjectKey } from './normalizationHelpers';
import { AGENCY_MEMBERS_POSITIONS } from '../helpers/constants';

const { ADMINISTRATOR, EDITOR } = AGENCY_MEMBERS_POSITIONS;

export const LOAD_AGENCY_MEMBERS_SUCCESS = 'LOAD_AGENCY_MEMBERS_SUCCESS';

const groupByMembers = results => R.groupBy(member => member.role, results);
const groupIdsByRole = R.compose(R.map(extractIds), groupByMembers);

const initialState = {};

const loadAgencyMembersSuccess = members => ({ type: LOAD_AGENCY_MEMBERS_SUCCESS, members });

const getMembers = (pick, sortedMembers, allMembers) =>
  R.pick(R.flatten(R.props(pick, sortedMembers)), allMembers);
const getAdminMembers = R.curry(getMembers)(['Administrator']);
const getEditMembers = R.curry(getMembers)(['Editor']);
const getPossibleFocalPointsReviewers = R.curry(getMembers)(['Administrator', 'Editor']);

export const loadAgencyMembers = agencyId => dispatch => getAgencyMembers(agencyId)
  .then((response) => {
    dispatch(loadAgencyMembersSuccess(response.results));
  });

const saveMembers = members => ({
  sortedMembers: groupIdsByRole(members),
  allMembers: toObject(flattenToId, members),
  allMembersShort: toObject(flattenToObjectKey('name'), members),
});

export const selectPossibleFocalPointsReviewers = (state) => {
  const { sortedMembers = {}, allMembersShort = {} } = state;
  return getPossibleFocalPointsReviewers(sortedMembers, allMembersShort);
};

export default function agencyMembersReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AGENCY_MEMBERS_SUCCESS: {
      return saveMembers(action.members);
    }
    default:
      return state;
  }
}
