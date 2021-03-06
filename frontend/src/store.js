
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import R from 'ramda';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { browserHistory } from 'react-router';

import cfei from './reducers/cfei';
import cfeiNav from './reducers/cfeiNav';
import newCfei from './reducers/newCfei';
import nav from './reducers/nav';
import session from './reducers/session';
import offices from './reducers/offices';
import countries from './reducers/countries';
import deleteClarificationAnswer from './reducers/deleteClarificationAnswer';
import addClarificationRequest from './reducers/addClarificationRequest';
import addClarificationAnswer from './reducers/addClarificationAnswer';
import clarificationRequests, * as clarificationRequestsSelector from './reducers/clarificationRequests';
import clarificationAnswers, * as clarificationAnswersSelector from './reducers/clarificationAnswers';
import countryProfiles from './reducers/countryProfiles';
import partnerProfileEdit from './reducers/partnerProfileEdit';
import partnerProfileDetails from './reducers/partnerProfileDetails';
import cfeiDetails, * as cfeiDetailsSelector from './reducers/cfeiDetails';
import cfeiDetailsNav, { selectItemsByType } from './reducers/cfeiDetailsNav';
import agencyPartnersList from './reducers/agencyPartnersList';
import agencyPartnerProfileNav from './reducers/agencyPartnerProfileNav';
import agencyPartnerProfile from './reducers/agencyPartnerProfile';
import agencyMembersList from './reducers/agencyMembersList';
import applicationsNotesList from './reducers/applicationsNotesList';
import applicationsUnsolicitedList from './reducers/applicationsUnsolicitedList';
import applicationsDirectList from './reducers/applicationsDirectList';
import conceptNote from './reducers/conceptNote';
import commonFileUpload from './reducers/commonFileUpload';
import organizationProfileNav from './reducers/organizationProfileNav';
import partnerApplicationsNav from './reducers/partnerApplicationsNav';
import partnerProfileConfig from './reducers/partnerProfileConfig';
import partnerProfileDetailsUpdate from './reducers/partnerProfileDetailsUpdate';
import partnerProfileDetailsNav from './reducers/partnerProfileDetailsNav';
import sectors, * as sectorsSelectors from './reducers/sectors';
import partnersApplicationsList from './reducers/partnersApplicationsList';
import partnersPreselectionList from './reducers/partnersPreselectionList';
import selectionCriteria from './reducers/selectionCriteria';
import adminOneLocation from './reducers/adminOneLocation';
import partnerNames from './reducers/partnerNames';
import applicationDetails, * as applicationDetailsSelector from './reducers/applicationDetails';
import applicationReviews, * as applicationReviewsSelector from './reducers/applicationReviews';
import agencyMembers, * as agencyMembersSelectors from './reducers/agencyMembers';
import partnerAppDetails, * as partnerAppDetailsSelector from './reducers/partnerApplicationDetails';
import agencies from './reducers/agencies';
import applicationFeedback, * as applicationFeedbackSelector from './reducers/applicationFeedback';
import recommendedPartners, * as recommendedPartnersSelector from './reducers/recommendedPartners';
import preselectedPartners, * as preselectedPartnersSelector from './reducers/preselectedPartners';
import partnerVerifications, * as partnerVerificationsSelector from './reducers/partnerVerifications';
import partnerVerificationsList from './reducers/partnerVerificationsList';
import cfeiReviewSummary, { selectReviewSummary } from './reducers/cfeiReviewSummary';
import cfeiAwardedPartners, { selectAwardedPartners } from './reducers/cfeiAwardedPartners';
import cfeiReviewers, { selectReviewers } from './reducers/cfeiReviewers';
import dashboard from './reducers/dashboard';
import partnerFlags, * as partnerFlagsSelector from './reducers/partnerFlags';
import agencyPartnerApplicationList from './reducers/agencyPartnerApplicationList';
import applicationsToScore from './reducers/applicationsToScore';
import pendingOffers from './reducers/pendingOffers';
import submittedCN from './reducers/submittedCN';
import applicationDecisions from './reducers/applicationsDecisions';
import applicationComparison from './reducers/applicationsComparison';
import notificationsList from './reducers/notificationsList';
import cache from './reducers/cache';
import error, * as errorSelector from './reducers/errorReducer';
import routesHistory from './reducers/routesHistory';
import applicationComparisonReport from './reducers/applicationsComparisonReport';
import openCfeiDashboardList from './reducers/openCfeiDashboardList';
import publishCfei from './reducers/publishCfei';
import sendCfei from './reducers/sendCfei';
import deleteCfei from './reducers/deleteCfei';
import deleteUcn from './reducers/deleteUcn';
import submitUcn from './reducers/submitUcn';
import partnerObservationsList from './reducers/agencyPartnerObservationsList';
import reportsNav from './reducers/reportsNav';
import reportsPartnerList from './reducers/reportsPartnerInformationList';
import reportsCfeiManagementList from './reducers/reportsCfeiManagementList';
import reportVerificationList from './reducers/reportsVerificationList';
import selectableList from './reducers/selectableListItems';
import generatePartnerReports from './reducers/partnerReportsGeneration';
import partnerMembersList from './reducers/partnerMembersList';
import vendorNumber from './reducers/vendorNumber';
import removeVendorNumber from './reducers/deleteVendorNumber';
import partnerUnData from './reducers/partnerUnData';
import completeAssessment from './reducers/completeAssessment';
import sendCfeiForDecision from './reducers/sendCfeiForDecision';
// ID portal

import idPortalNav from './idPortal/reducers/nav';
import idPortalUsersList from './idPortal/reducers/usersList';
import idPortalNewUser from './idPortal/reducers/newUser';
import idPortalEditUser from './idPortal/reducers/editUser';
import idPortalDeactivateUser from './idPortal/reducers/deactivateUser';


const mainReducer = combineReducers({
  clarificationAnswers,
  clarificationRequests,
  sendCfeiForDecision,
  addClarificationAnswer,
  addClarificationRequest,
  deleteClarificationAnswer,
  completeAssessment,
  recommendedPartners,
  preselectedPartners,
  partnerUnData,
  vendorNumber,
  removeVendorNumber,
  cfei,
  cfeiNav,
  cfeiDetails,
  cfeiDetailsNav,
  newCfei,
  publishCfei,
  deleteCfei,
  partnerMembersList,
  sendCfei,
  deleteUcn,
  submitUcn,
  selectableList,
  reportsPartnerList,
  reportsCfeiManagementList,
  reportVerificationList,
  generatePartnerReports,
  organizationProfileNav,
  partnerApplicationsNav,
  applicationsNotesList,
  applicationsUnsolicitedList,
  applicationsDirectList,
  openCfeiDashboardList,
  adminOneLocation,
  partnerObservationsList,
  nav,
  offices,
  session,
  error,
  countries,
  conceptNote,
  countryProfiles,
  commonFileUpload,
  partnerProfileConfig,
  partnerProfileEdit,
  partnerProfileDetails,
  partnerProfileDetailsNav,
  partnerProfileDetailsUpdate,
  agencyMembersList,
  agencyPartnersList,
  agencyPartnerProfileNav,
  agencyPartnerProfile,
  form: formReducer,
  routing: routerReducer,
  sectors,
  partnersApplicationsList,
  partnersPreselectionList,
  selectionCriteria,
  partnerNames,
  applicationDetails,
  applicationReviews,
  agencyMembers,
  partnerAppDetails,
  applicationFeedback,
  agencies,
  agencyPartnerApplicationList,
  partnerVerifications,
  partnerVerificationsList,
  cfeiReviewSummary,
  cfeiAwardedPartners,
  cfeiReviewers,
  dashboard,
  partnerFlags,
  applicationsToScore,
  pendingOffers,
  submittedCN,
  applicationDecisions,
  applicationComparison,
  notificationsList,
  cache,
  routesHistory,
  applicationComparisonReport,
  reportsNav,

  // ID portal
  idPortalNav,
  idPortalUsersList,
  idPortalNewUser,
  idPortalEditUser,
  idPortalDeactivateUser,
});

const middleware = [thunk, routerMiddleware(browserHistory)];
// TODO(marcindo: disable devtools in prod
let composeEnhancers = compose;
if (process.env.NODE_ENV !== 'production') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
}

const slicer = paths => state => paths.reduce((acc, curr) => {
  const path = R.split('.', curr);

  return R.assocPath(path, R.path(path, state), acc);
}, {});

export default createStore(
  mainReducer,
  composeEnhancers(
    applyMiddleware(...middleware),
    persistState([
      'session.partnerId',
      'session.newlyRegistered',
    ], { slicer }),
  ),
);

const makeFormItem = (list) => {
  let [value, label] = list;
  if (!isNaN(value)) value = Number(value);
  return { value, label };
};

export const mapValuesForSelectionField = (state, compareField = 'label') => {
  const compare = (a, b) => a[compareField].localeCompare(b[compareField]);
  return R.sort(compare, R.map(makeFormItem, R.toPairs(state)));
};

export const mapArrayForSelectionField = (state, compareField = 'label') => {
  const compare = (a, b) => a[compareField].localeCompare(b[compareField]);
  return R.sort(compare, R.map(item => makeFormItem(R.values(item)), state));
};

export const selectNormalizedCountries = state =>
  mapValuesForSelectionField(state.countries);

export const selectNormalizedOrganizationTypes = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['partner-type']);

export const selectNormalizedYearsOfExperience = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['years-of-exp-choices'], 'value');

export const selectNormalizedWorkingLanguages = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['working-languages']);

export const selectNormalizedPopulationsOfConcernGroups = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['population-of-concern']);

export const selectNormalizedStaffGlobalyChoices = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['staff-globaly-choices'], 'value');

export const selectNormalizedBudgets = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['budget-choices'], 'value');

export const selectNormalizedBusinessAreas = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['business-areas'], 'value');

export const selectNormalizedDirectJustification = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['direct-justifications'], 'value');

export const selectApplicationStatuses = state => state.partnerProfileConfig['application-statuses'];

export const selectExtendedApplicationStatuses = state =>
  state.partnerProfileConfig['extended-application-statuses'];

export const selectNormalizedExtendedApplicationStatuses = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['extended-application-statuses']);

export const selectOrganizationTypes = state => state.partnerProfileConfig['partner-type'];

export const selectNormalizedApplicationStatuses = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['application-statuses']);

export const selectNormalizedAuditTypes = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['audit-types']);

export const selectNormalizedNotificationsFrequencies = (state) => {
  let frequncies = state.partnerProfileConfig['notification-frequency-choices'];
  frequncies = R.dissoc('', frequncies);
  frequncies['0_disabled'] = 'Disabled';

  return mapValuesForSelectionField(frequncies, 'value');
};

export const selectNormalizedCapacityAssessments = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['formal-capacity-assessment']);

export const selectNormalizedPartnerDonors = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['partner-donors']);

export const selectNormalizedMethodAccAdopted = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['method-acc-adopted-choices']);

export const selectNormalizedFinancialControlSystem = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['financial-control-system-choices']);

export const selectNormalizedFunctionalResponsibility = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['functional-responsibility-choices']);

export const selectNormalizedPolicyArea = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['policy-area-choices']);

export const selectNormalizedDirectSelectionSource = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['direct-selection-source']);

export const selectNormalizedCfeiTypes = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['cfei-types']);

export const selectNormalizedCfeiStatuses = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['cfei-statuses']);

export const selectNormalizedFlagTypes = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['flag-types'], 'value');

export const selectCountriesWithOptionalLocations = state =>
  state.partnerProfileConfig['countries-with-optional-location'];

export const selectNormalizedRoleChoices = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['user-role-choices']);

export const selectNormalizedRoleFilter = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['user-role-filter']);

export const selectNormalizedOffices = state =>
  mapArrayForSelectionField(state.offices['user-offices-choices']);

export const selectNormalizedOfficesFilter = state =>
  mapArrayForSelectionField(state.offices['user-offices-filter']);

export const selectNormalizedSpecializations = state =>
  mapValuesForSelectionField(state.sectors.allSpecializations);

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

export const selectMappedSpecializations = state =>
  sectorsSelectors.selectMappedSpecializations(state.sectors);

export const selectCfeiDetailsItemsByType = (state, type) =>
  selectItemsByType(state.cfeiDetailsNav, type);

export const selectCfeiDetails = (state, id) =>
  cfeiDetailsSelector.selectCfeiDetail(state.cfeiDetails.data, id);

export const selectCfeiTitle = (state, id) =>
  cfeiDetailsSelector.selectCfeiTitle(state.cfeiDetails.data, id);

export const selectCfeiAgency = (state, id) =>
  cfeiDetailsSelector.selectCfeiAgency(state.cfeiDetails.data, id);

export const selectCfeiCriteria = (state, id) =>
  cfeiDetailsSelector.selectCfeiCriteria(state.cfeiDetails.data, id);

export const selectCfeiStatus = (state, id) =>
  cfeiDetailsSelector.selectCfeiStatus(state.cfeiDetails.data, id);

export const selectCfeiDisplayStatus = (state, id) =>
  cfeiDetailsSelector.selectCfeiDisplayStatus(state.cfeiDetails.data, id);

export const selectCfeiConverted = (state, id) =>
  cfeiDetailsSelector.selectCfeiConverted(state.cfeiDetails.data, id);

export const selectCfeiCompletedReason = (state, id) =>
  cfeiDetailsSelector.selectCfeiCompletedReason(state.cfeiDetails.data, id);

export const selectCfeiCompletedReasonDisplay = (state, id) =>
  cfeiDetailsSelector.selectCfeiCompletedReasonDisplay(state.cfeiDetails.data, id);

export const isCfeiCompleted = (state, id) =>
  cfeiDetailsSelector.isCfeiCompleted(state.cfeiDetails.data, id);

export const selectPartnerVerified = (state, id) =>
  cfeiDetailsSelector.selectPartnerVerified(state.cfeiDetails.data, id);

export const selectPartnerFlagStatus = (state, id) =>
  cfeiDetailsSelector.selectPartnerFlagStatus(state.cfeiDetails.data, id);

export const isUserFinishedReview = (state, id) =>
  cfeiDetailsSelector.isUserFinishedReview(state.cfeiDetails.data, id);

export const isUserCompletedAssessment = (state, id) =>
  cfeiDetailsSelector.isUserCompletedAssessment(state.cfeiDetails.data, id);

export const isCfeiPublished = (state, id) =>
  cfeiDetailsSelector.isCfeiPublished(state.cfeiDetails.data, id);

export const isCfeiDeadlinePassed = (state, id) =>
  cfeiDetailsSelector.isCfeiDeadlinePassed(state.cfeiDetails.data, id);

export const isCfeiClarificationDeadlinePassed = (state, id) =>
  cfeiDetailsSelector.isCfeiClarificationDeadlinePassed(state.cfeiDetails.data, id);

export const cfeiHasRecommendedPartner = (state, id) =>
  cfeiDetailsSelector.cfeiHasRecommendedPartner(state.cfeiDetails.data, id);

export const cfeiHasPartnerAccepted = (state, id) =>
  cfeiDetailsSelector.cfeiHasPartnerAccepted(state.cfeiDetails.data, id);

export const isCfeiPinned = (state, id) =>
  cfeiDetailsSelector.isCfeiPinned(state.cfeiDetails.data, id);

export const selectCfeiWinnersStatus = (state, id) =>
  cfeiDetailsSelector.selectCfeiWinnersStatus(state.cfeiDetails.data, id);

export const mapSelectCriteriaToSelection = state =>
  mapValuesForSelectionField(state.selectionCriteria);

export const mapPartnersNamesToSelection = state =>
  mapValuesForSelectionField(state.partnerNames);

export const selectApplicationStatus = (state, id) =>
  applicationDetailsSelector.selectApplicationStatus(
    state.applicationDetails.data, id);

export const selectApplicationPartnerName = (state, id) =>
  applicationDetailsSelector.selectApplicationPartnerName(
    state.applicationDetails.data, id);

export const selectApplicationProject = (state, id) =>
  applicationDetailsSelector.selectApplicationProject(
    state.applicationDetails.data, id);

export const selectApplication = (state, id) =>
  applicationDetailsSelector.selectApplication(
    state.applicationDetails.data, id);

export const selectApplicationWithdrawalStatus = (state, id) =>
  applicationDetailsSelector.selectApplicationWithdrawStatus(
    state.applicationDetails.data, id);

export const selectApplicationCurrentStatus = (state, id) =>
  applicationDetailsSelector.selectApplicationCurrentStatus(
    state.applicationDetails.data, id);

export const selectReview = (state, reviewId) =>
  applicationReviewsSelector.selectReview(state.applicationReviews, reviewId);

export const selectReviewer = (state, reviewerId) =>
  applicationReviewsSelector.selectReviewer(state.applicationReviews, reviewerId);

export const selectAssessment = (state, assessmentId) =>
  applicationReviewsSelector.selectAssessment(state.applicationReviews, assessmentId);

export const isAssesmentAdded = (state, assessmentId) =>
  applicationReviewsSelector.isAssesmentAdded(state.applicationReviews, assessmentId);

export const mapFocalPointsReviewersToSelection = state =>
  mapValuesForSelectionField(
    agencyMembersSelectors.selectPossibleFocalPointsReviewers(state.agencyMembers.data));

export const cfeiDetailsReviewers = (state, cfeiId) => cfeiDetailsSelector.cfeiDetailsReviewers(
  state.cfeiDetails.data, cfeiId, state.session.userId);

export const isUserACreator = (state, cfeiId) => cfeiDetailsSelector.isUserACreator(
  state.cfeiDetails.data, cfeiId, state.session.userId);

export const isUserAReviewer = (state, cfeiId) => cfeiDetailsSelector.isUserAReviewer(
  state.cfeiDetails.data, cfeiId, state.session.userId);

export const isUserAFocalPoint = (state, cfeiId) => cfeiDetailsSelector.isUserAFocalPoint(
  state.cfeiDetails.data, cfeiId, state.session.userId);

export const isSendForDecision = (state, cfeiId) => cfeiDetailsSelector.isSendForDecision(
  state.cfeiDetails.data, cfeiId, state.session.userId);

export const selectNormalizedCompletionReasons = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['completed-reason']);

export const selectNormalizedFlagCategoryChoices = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['flag-category-choices'], 'value');

export const selectAllFlagCategoryChoices = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['all-flag-category-choices'], 'value');

export const selectNormalizedFlagTypeChoices = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['flag-type-choices'], 'value');

export const selectNormalizedDsrFinalizeOptions = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['direct-selection-completed-reason']);

export const selectNormalizedTimePeriods = state =>
  mapValuesForSelectionField(state.partnerProfileConfig['direct-selection-retention'], 'value');

export const selectPartnerApplicationDetails = (state, cfeiId) =>
  partnerAppDetailsSelector.selectApplication(state.partnerAppDetails, cfeiId);

export const selectApplicationFeedback = (state, applicationId) =>
  applicationFeedbackSelector.selectFeedback(state.applicationFeedback, applicationId);

export const selectApplicationFeedbackCount = (state, applicationId) =>
  applicationFeedbackSelector.selectCount(state.applicationFeedback, applicationId);

export const selectRecommendedPartnersCount = (state, cfeiId) =>
  recommendedPartnersSelector.selectCount(state.recommendedPartners, cfeiId);

export const selectRecommendedPartners = (state, cfeiId) =>
  recommendedPartnersSelector.selectPartners(state.recommendedPartners, cfeiId);

export const selectClarificationRequestsCount = (state, cfeiId) =>
  clarificationRequestsSelector.selectCount(state.clarificationRequests, cfeiId);

export const selectClarificationRequests = (state, cfeiId) =>
  clarificationRequestsSelector.selectRequests(state.clarificationRequests, cfeiId);

export const selectClarificationAnswersCount = (state, cfeiId) =>
  clarificationAnswersSelector.selectCount(state.clarificationAnswers, cfeiId);

export const selectClarificationAnswers = (state, cfeiId) =>
  clarificationAnswersSelector.selectAnswers(state.clarificationAnswers, cfeiId);

export const selectPreselectedPartnersCount = (state, cfeiId) =>
  preselectedPartnersSelector.selectCount(state.preselectedPartners, cfeiId);

export const selectPreselectedPartners = (state, cfeiId) =>
  preselectedPartnersSelector.selectPartners(state.preselectedPartners, cfeiId);

export const selectPartnerVerifications = (state, partnerId) =>
  partnerVerificationsSelector.selectVerifications(state.partnerVerifications, partnerId);

export const selectMostRecentVerification = (state, partnerId) =>
  partnerVerificationsSelector.selectMostRecentVerification(state.partnerVerifications, partnerId);

export const selectPreviousVerificationCount = (state, partnerId) =>
  partnerVerificationsSelector.selectPreviousVerificationsCount(state.partnerVerifications,
    partnerId);

export const mapAgenciesNamesToSelection = state => mapValuesForSelectionField(state.agencies.data);

export const selectCfeiReviewSummary = (state, cfeiId) =>
  selectReviewSummary(state.cfeiReviewSummary.data, cfeiId);

export const selectCfeiReviewers = (state, cfeiId) =>
  selectReviewers(state.cfeiReviewers.data, cfeiId);

export const selectCfeiAwardedPartners = (state, cfeiId) =>
  selectAwardedPartners(state.cfeiAwardedPartners.data, cfeiId);

export const selectPartnerFlags = (state, partnerId) =>
  partnerFlagsSelector.selectPartnerFlags(state.partnerFlags, partnerId);

export const selectPartnerFlagsCount = (state, partnerId) =>
  partnerFlagsSelector.selectPartnerFlagsCount(state.partnerFlags, partnerId);

export const selectAllErrorsMapped = state => errorSelector.selectAllErrorsMapped(state.error);

export const isUserHq = state => state.session.isHq;

export const selectUserHqId = state => state.session.hqId;

export const selectUserPartnerId = state => state.session.partnerId;
