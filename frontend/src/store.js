
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import R from 'ramda';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';

import cfei from './reducers/cfei';
import cfeiNav from './reducers/cfeiNav';
import newCfei from './reducers/newCfei';
import nav from './reducers/nav';
import session from './reducers/session';
import countries from './reducers/countries';
import countryProfiles from './reducers/countryProfiles';
import partnerProfileEdit from './reducers/partnerProfileEdit';
import partnerProfileDetails from './reducers/partnerProfileDetails';
import cfeiDetails, * as cfeiDetailsSelector from './reducers/cfeiDetails';
import cfeiDetailsNav, { selectItemsByType } from './reducers/cfeiDetailsNav';
import agencyPartnersList from './reducers/agencyPartnersList';
import agencyPartnerProfileNav from './reducers/agencyPartnerProfileNav';
import agencyPartnerProfile from './reducers/agencyPartnerProfile';
import applicationsNotesList from './reducers/applicationsNotesList';
import applicationsUnsolicitedList from './reducers/applicationsUnsolicitedList';
import applicationsDirectList from './reducers/applicationsDirectList';
import conceptNote from './reducers/conceptNote';
import population from './reducers/population';
import partnerInfo from './reducers/partnerInfo';
import organizationProfileNav from './reducers/organizationProfileNav';
import organizationProfile from './reducers/organizationProfile';
import partnerApplicationsNav from './reducers/partnerApplicationsNav';
import partnerProfileConfig from './reducers/partnerProfileConfig';
import sectors, * as sectorsSelectors from './reducers/sectors';
import partnersApplicationsList from './reducers/partnersApplicationsList';
import partnersPreselectionList from './reducers/partnersPreselectionList';
import selectionCriteria from './reducers/selectionCriteria';
import partnerNames from './reducers/partnerNames';

const mainReducer = combineReducers({
  cfei,
  cfeiNav,
  cfeiDetails,
  cfeiDetailsNav,
  newCfei,
  organizationProfile,
  organizationProfileNav,
  partnerApplicationsNav,
  applicationsNotesList,
  applicationsUnsolicitedList,
  applicationsDirectList,
  nav,
  session,
  countries,
  conceptNote,
  countryProfiles,
  partnerInfo,
  partnerProfileConfig,
  partnerProfileEdit,
  partnerProfileDetails,
  agencyPartnersList,
  agencyPartnerProfileNav,
  agencyPartnerProfile,
  form: formReducer,
  population,
  routing: routerReducer,
  sectors,
  partnersApplicationsList,
  partnersPreselectionList,
  selectionCriteria,
  partnerNames,
});

const middelware = [thunk, routerMiddleware(browserHistory)];
// TODO(marcindo: disable devtools in prod
let composeEnhancers = compose;
if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
}

export default createStore(
  mainReducer,
  composeEnhancers(
    applyMiddleware(...middelware),
  ),
);

const mapValuesForSelectionField = (state) => {
  const makeFormItem = list => R.zipObj(['value', 'label'], list);
  const compare = (a, b) => a.label.localeCompare(b.label);
  return R.sort(compare, R.map(makeFormItem, R.toPairs(state)));
};

const mapValuesForSelectionSortValue = (state) => {
  const makeFormItem = list => R.zipObj(['value', 'label'], list);
  const compare = (a, b) => a.value.localeCompare(b.value);
  return R.sort(compare, R.map(makeFormItem, R.toPairs(state)));
};

export const selectNormalizedCountries = state =>
  mapValuesForSelectionField(state.countries);

export const selectNormalizedOrganizationTypes = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['partner-type']);

export const selectNormalizedYearsOfExperience = state =>
  mapValuesForSelectionSortValue(state.partnerProfileConfig['years-of-exp-choices']);

export const selectNormalizedWorkingLanguages = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['working-languages']);

export const selectNormalizedPopulationsOfConcernGroups = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['population-of-concerns-groups']);

export const selectNormalizedStaffGlobalyChoices = state =>
  mapValuesForSelectionSortValue(state.partnerProfileConfig['staff-globaly-choices']);

export const selectNormalizedBudgets = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['budget-choices']);

export const selectNormalizedPartnerDonors = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['partner-donors']);

export const selectNormalizedPopulations = state =>
  mapValuesForSelectionField(state.population);

export const mapSectorsToSelection = state =>
  mapValuesForSelectionField(sectorsSelectors.selectAllSectors(state.sectors));

export const mapSpecializationsToSelection = (state, sectorId) =>
  mapValuesForSelectionField(
    sectorsSelectors.selectSpecializationsForSector(state.sectors, sectorId));

export const selectSector = (state, id) =>
  sectorsSelectors.selectSector(state.sectors, id);

export const selectSpecializations = (state, ids) =>
  sectorsSelectors.selectSpecializations(state.sectors, ids);

export const selectCfeiDetailsItemsByType = (state, type) =>
  selectItemsByType(state.cfeiDetailsNav, type);

export const selectCfeiDetails = (state, id) =>
  cfeiDetailsSelector.selectCfeiDetail(state.cfeiDetails.cfeiDetails, id);

export const selectCfeiTitle = (state, id) =>
  cfeiDetailsSelector.selectCfeiTitle(state.cfeiDetails.cfeiDetails, id);

export const mapSelectCriteriaToSelection = state =>
  mapValuesForSelectionField(state.selectionCriteria)
;
export const mapPartnersNamesToSelection = state =>
  mapValuesForSelectionField(state.partnerNames);
