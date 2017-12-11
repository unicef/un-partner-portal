import R from 'ramda';
import { combineReducers } from 'redux';
import { getPartnersList } from '../helpers/api/api';
import { sendRequest } from '../helpers/apiHelper';
import apiMeta, { success } from './apiMeta';

const savePartners = (state, action) => {
  const partners = R.assoc('partners', action.results, state);
  return R.assoc('totalCount', action.count, partners);
};

const errorMsg = 'Load partners failed.';
const AGENCY_PARTNERS_LIST = 'AGENCY_PARTNERS_LIST';
const tag = 'agencyPartnersList';

const initialState = {
  columns: [
    { name: 'name', title: 'Organization\'s Legal Name' },
    { name: 'acronym', title: 'Acronym', width: 100 },
    { name: 'display_type', title: 'Type of Organization' },
    { name: 'country_code', title: 'Country' },
    { name: 'experience_working', title: 'Experience working with UN' },
  ],
  partners: [],
  totalCount: 0,
};

export const loadPartnersList = params => sendRequest({
  loadFunction: getPartnersList,
  meta: {
    reducerTag: tag,
    actionTag: AGENCY_PARTNERS_LIST,
    isPaginated: true,
  },
  errorHandling: { userMessage: errorMsg },
  apiParams: [params],
});

function agencyPartnersListReducer(state = initialState, action) {
  switch (action.type) {
    case success`${AGENCY_PARTNERS_LIST}`: {
      return savePartners(state, action);
    }
    default:
      return state;
  }
}

export default combineReducers({ data: agencyPartnersListReducer,
  status: apiMeta(AGENCY_PARTNERS_LIST) });
