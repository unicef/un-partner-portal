import R from 'ramda';
import { combineReducers } from 'redux';
import { getNewRequestToken } from '../helpers/apiHelper';
import apiMeta, {
  success,
  loadStarted,
  loadEnded,
  loadSuccess,
  loadFailure } from './apiMeta';
import { getAgencyMembers } from '../helpers/api/api';
import { extractIds, flattenToId, toObject, flattenToObjectKey } from './normalizationHelpers';
import { AGENCY_MEMBERS_POSITIONS } from '../helpers/constants';


const { ADMINISTRATOR, EDITOR } = AGENCY_MEMBERS_POSITIONS;
const tag = 'agencyMembers';
const AGENCY_MEMBERS = 'AGENCY_MEMBERS';

const groupByMembers = results => R.groupBy(member => member.role, results);
const groupIdsByRole = R.compose(R.map(extractIds), groupByMembers);

const initialState = {};

const getMembers = (pick, sortedMembers, allMembers) =>
  R.pick(R.flatten(R.props(pick, sortedMembers)), allMembers);
const getAdminMembers = R.curry(getMembers)([ADMINISTRATOR]);
const getEditMembers = R.curry(getMembers)([EDITOR]);
const getPossibleFocalPointsReviewers = R.curry(getMembers)([ADMINISTRATOR, EDITOR]);

export const loadAgencyMembers = (agencyId, params) => dispatch =>
  getAgencyMembers(agencyId, params)
    .then((response) => {
      dispatch(loadSuccess(AGENCY_MEMBERS, { members: response.results }));
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

export const loadAgencyMembersForAutoComplete = params => (dispatch, getState) => {
  const newCancelToken = getNewRequestToken(getState, tag);
  const agencyId = getState().session.agencyId;
  dispatch(loadStarted(AGENCY_MEMBERS, newCancelToken));
  return getAgencyMembers(
    agencyId,
    { role: 'Adm,Edi', ...params },
    { cancelToken: newCancelToken.token })
    .then((response) => {
      dispatch(loadEnded(AGENCY_MEMBERS));
      return toObject(flattenToObjectKey('name'), response.results);
    }).catch((error) => {
      dispatch(loadEnded(AGENCY_MEMBERS));
      dispatch(loadFailure(AGENCY_MEMBERS, error));
    });
};


function agencyMembersReducer(state = initialState, action) {
  switch (action.type) {
    case success`${AGENCY_MEMBERS}`: {
      return saveMembers(action.members);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: agencyMembersReducer, status: apiMeta(AGENCY_MEMBERS) });
