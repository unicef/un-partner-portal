import R from 'ramda';
import { getAgencyMembers } from '../helpers/api/api';
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
const getAdminMembers = R.curry(getMembers)([ADMINISTRATOR]);
const getEditMembers = R.curry(getMembers)([EDITOR]);
const getPossibleFocalPointsReviewers = R.curry(getMembers)([ADMINISTRATOR, EDITOR]);

export const loadAgencyMembers = (agencyId, params) => dispatch =>
  getAgencyMembers(agencyId, params)
    .then((response) => {
      dispatch(loadAgencyMembersSuccess(response.results));
      return response.results;
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

export const loadAgencyMembersForAutoComplete = (agencyId, params) =>
  getAgencyMembers(agencyId, params)
    .then((response) => {
      return selectPossibleFocalPointsReviewers(saveMembers(response.results));
    });


export default function agencyMembersReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_AGENCY_MEMBERS_SUCCESS: {
      return saveMembers(action.members);
    }
    default:
      return state;
  }
}
