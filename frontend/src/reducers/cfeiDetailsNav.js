import R from 'ramda';
import { SESSION_INIT } from './session';
import { PARTNER, AGENCY, filterItems } from './nav';
import { PROJECT_TYPES, DETAILS_ITEMS } from '../helpers/constants';

const initialState = [
  {
    path: DETAILS_ITEMS.OVERVIEW,
    label: 'Overview',
    roles: [AGENCY, PARTNER],
    types: [PROJECT_TYPES.OPEN, PROJECT_TYPES.DIRECT, PROJECT_TYPES.UNSOLICITED],
  },
  {
    path: DETAILS_ITEMS.FEEDBACK,
    label: 'Feedback',
    roles: [AGENCY],
    types: [PROJECT_TYPES.DIRECT, PROJECT_TYPES.UNSOLICITED],
  },
  {
    path: DETAILS_ITEMS.SUBMISSION,
    label: 'concept note submission',
    roles: [PARTNER],
    types: [PROJECT_TYPES.OPEN],
  },
  {
    path: DETAILS_ITEMS.APPLICATIONS,
    label: 'applications',
    roles: [AGENCY],
    types: [PROJECT_TYPES.OPEN],
  },
  {
    path: DETAILS_ITEMS.PRESELECTED,
    label: 'preselected list',
    roles: [AGENCY],
    types: [PROJECT_TYPES.OPEN],
  },
  {
    path: DETAILS_ITEMS.RESULTS,
    label: 'results',
    roles: [PARTNER, AGENCY],
    types: [PROJECT_TYPES.OPEN],
  },
];

export const selectItemsByType = (state, type) =>
  R.filter(item => R.any(R.equals(type), item.types), state);

export default function cfeiNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return filterItems(state, action.session.role);
    }
    default:
      return state;
  }
}
