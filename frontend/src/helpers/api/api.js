import axios from 'axios';
import moment from 'moment-timezone';
import store from '../../store';

const host = '/api';

// Internal help/generic functions
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (`${name}=`)) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function buildHeaders(authorize = false, extraHeaders = {}) {
  const token = store.getState().session.token;
  const partnerId = store.getState().session.partnerId;
  const officeId = store.getState().session.officeId;
  let headers = {
    Pragma: 'no-cache',
    'Cache-Control': 'no-cache',
    'Client-Timezone-Name': moment.tz.guess(),
  };
  if (authorize) headers = { ...headers, Authorization: `token ${token}` };
  if (partnerId) headers = { ...headers, 'Partner-ID': partnerId };
  if (officeId) headers = { ...headers, 'Agency-Office-ID': officeId };
  return { ...headers, ...extraHeaders };
}

function get(uri, params = {}, options) {
  const opt = { method: 'GET', params, headers: buildHeaders() };
  return axios.get(`${host}${uri}`, { ...opt, ...options })
    .then(response => response.data);
}

function post(uri, body = {}) {
  const options = {
    headers: buildHeaders(false, { 'X-CSRFToken': getCookie('csrftoken') }),
  };
  return axios.post(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedGet({ uri, params = {}, options }) {
  const opt = {
    params,
    headers: buildHeaders(true),
  };
  return axios.get(`${host}${uri}`, { ...options, ...opt })
    .then(response => response.data);
}

function authorizedPost({ uri, params, body = {} }) {
  const options = {
    params,
    headers: buildHeaders(true, { 'X-CSRFToken': getCookie('csrftoken') }),
  };

  return axios.post(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedDelete({ uri, params }) {
  const options = {
    params,
    headers: buildHeaders(true, { 'X-CSRFToken': getCookie('csrftoken') }),
  };
  return axios.delete(`${host}${uri}`, options)
    .then(response => response.data);
}

function authorizedPatch({ uri, params, body = {} }) {
  const options = {
    params,
    headers: buildHeaders(true, { 'X-CSRFToken': getCookie('csrftoken') }),
  };
  return axios.patch(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedPut({ uri, params, body = {} }) {
  const options = {
    params,
    headers: buildHeaders(true, { 'X-CSRFToken': getCookie('csrftoken') }),
  };
  return axios.put(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedPostUpload({ uri, body = {}, params }) {
  const options = {
    params,
    headers: buildHeaders(true, {
      'content-type': 'multipart/form-data',
      'X-CSRFToken': getCookie('csrftoken'),
    }),
  };
  return axios.post(`${host}${uri}`, body, options)
    .then(response => response.data);
}


// Accounts
export function postRegistration(body) {
  return post('/accounts/registration', body);
}

export function login(body) {
  return post('/rest-auth/login/', body);
}

export function logout() {
  return post('/rest-auth/logout/');
}

export function getUserData() {
  return authorizedGet({ uri: '/accounts/me/' });
}

export const passwordReset = post.bind(null, '/rest-auth/password/reset/');

export const passwordResetConfirm = post.bind(null, '/rest-auth/password/reset/confirm/');

// Config
export function getCountries() {
  return get('/config/countries');
}

export function getSectors() {
  return get('/config/sectors');
}

// Project
export function getOpenCfei(filters, options) {
  return authorizedGet({ uri: '/projects/open', params: filters, options });
}

export function getPinnedCfei(filters, options) {
  return authorizedGet({ uri: '/projects/pins', params: filters, options });
}

export function getDirectCfei(filters, options) {
  return authorizedGet({ uri: '/projects/direct', params: filters, options });
}

export function postOpenCfei(body) {
  return authorizedPost({ uri: '/projects/open/', body });
}

export function postDirectCfei(body) {
  return authorizedPost({ uri: '/projects/direct/', body });
}

export function patchCfei(body, id) {
  return authorizedPatch({ uri: `/projects/${id}/`, body });
}

export function publishCfei(id) {
  return authorizedPost({ uri: `/projects/${id}/publish/` });
}

export function submitUcn(id) {
  return authorizedPost({ uri: `/projects/applications/unsolicited/${id}/manage/` });
}

export function patchUcn(body, id) {
  return authorizedPatch({ uri: `/projects/applications/unsolicited/${id}/manage/`, body });
}

export function deleteUcn(id) {
  return authorizedDelete({ uri: `/projects/applications/unsolicited/${id}/manage/` });
}

export function deleteCfei(id) {
  return authorizedDelete({ uri: `/projects/${id}/` });
}

export function sendCfei(id) {
  return authorizedPost({ uri: `/projects/${id}/send-to-publish/` });
}

export function convertCnToDirectSelection(body, id) {
  return authorizedPost({ uri: `/projects/application/${id}/convert-unsolicited/`, body });
}

export function deleteConceptNote(projectId) {
  return authorizedDelete({ uri: `/projects/${projectId}/partner-applications-delete/` });
}

export function uploadConceptNote(projectId, body) {
  return authorizedPost({ uri: `/projects/${projectId}/partner-applications/`, body });
}

export function uploadCommonFile(body) {
  return authorizedPostUpload({ uri: '/common/file/', body });
}

export function getOpenCfeiDetails(id, options) {
  return authorizedGet({ uri: `/projects/${id}`, options });
}

export function getUnsolicitedCN(params, options) {
  return authorizedGet({ uri: '/projects/unsolicited', params, options });
}

export function patchPinnedCfei(body) {
  return authorizedPatch({ uri: '/projects/pins/', body });
}

export function postCompleteAssessment(id) {
  return authorizedPost({ uri: `/projects/${id}/applications/complete-assessments/` });
}

export function getCfeiReviewSummary(id, options) {
  return authorizedGet({ uri: `/projects/${id}/review-summary/`, options });
}

export function putCfeiReviewSummary(id, body) {
  return authorizedPatch({ uri: `/projects/${id}/review-summary/`, body });
}

export function getCfeiAwardedPartners(id, options) {
  return authorizedGet({ uri: `/projects/${id}/applications/awarded-partners/`, options });
}

export function getCfeiReviewers(id, options) {
  return authorizedGet({ uri: `/projects/${id}/applications/reviewers/`, options });
}

export function notifyReviewer(id, reviewerId) {
  return authorizedPost({ uri: `/projects/${id}/applications/reviewers/${reviewerId}/notify/` });
}

// Applications
export function getOpenCfeiApplications(id, filters, options) {
  return authorizedGet({ uri: `/projects/${id}/applications`, params: filters, options });
}

export function getProjectApplication(projectId, options) {
  return authorizedGet({ uri: `/projects/${projectId}/partner-application/`, options });
}

export function changeApplicationStatus(id, status) {
  return authorizedPatch({ uri: `/projects/application/${id}/`, body: { status } });
}

export function getApplicationDetails(id, options) {
  return authorizedGet({ uri: `/projects/application/${id}/`, options });
}

export function patchApplication(id, body) {
  return authorizedPatch({ uri: `/projects/application/${id}/`, body });
}

export function getApplicationConceptNotes(params, options) {
  return authorizedGet({ uri: '/projects/applications/open/', params, options });
}

export function getApplicationUnsolicitedConceptNotes(params, options) {
  return authorizedGet({ uri: '/projects/applications/unsolicited/', params, options });
}

export function getApplicationDirect(params, options) {
  return authorizedGet({ uri: '/projects/applications/direct/', params, options });
}

export function getApplicationReviews(applicationId, options) {
  return authorizedGet({ uri: `/projects/applications/${applicationId}/reviewers-status`, options });
}

export function postApplicationReview(applicationId, reviewerId, body) {
  return authorizedPost({
    uri: `/projects/applications/${applicationId}/reviewer-assessments/${reviewerId}/`,
    body });
}

export function putApplicationReview(applicationId, reviewerId, body) {
  return authorizedPut({
    uri: `/projects/applications/${applicationId}/reviewer-assessments/${reviewerId}/`,
    body });
}

export function getApplicationFeedback(applicationId, params, options) {
  return authorizedGet({
    uri: `/projects/application/${applicationId}/feedback/`,
    params,
    options });
}

export function postApplicationFeedback(applicationId, body) {
  return authorizedPost({
    uri: `/projects/application/${applicationId}/feedback/`,
    body });
}

export function postUnsolicitedCN(body) {
  return authorizedPost({ uri: '/projects/applications/unsolicited/', body });
}

export function getPartnerApplications(params, options) {
  return authorizedGet({ uri: '/projects/applications', params, options });
}

export function getApplicationComparison(id, params, options) {
  return authorizedGet({ uri: `/projects/${id}/applications/compare-selected/`, params, options });
}

// Partners
export function getPartnerProfileDetails(partnerId, options) {
  return authorizedGet({ uri: `/partners/${partnerId}`, options });
}

export function getPartnerProfileSummary(partnerId, options) {
  return authorizedGet({ uri: `/partners/${partnerId}/summary/`, options });
}

export function getPartnerNames(params, options) {
  return get('/partners/short', params, options);
}

export function getPartnersList(params, options) {
  return authorizedGet({ uri: '/partners', params, options });
}

export function getMembersList(id, params, options) {
  return authorizedGet({ uri: `/agencies/${id}/members`, params, options });
}

export function getPartnerMembersList(id, params, options) {
  return authorizedGet({ uri: `/partners/${id}/members`, params, options });
}

export function getNotifications(params, options) {
  return authorizedGet({ uri: '/notifications', params, options });
}

export function patchNotification(id, body) {
  return authorizedPatch({ uri: `/notifications/${id}/`, body });
}

export function patchNotifications(body) {
  return authorizedPatch({ uri: '/notifications/', body });
}

export function getGlobalConfig() {
  return get('/config/general/');
}

export function getOffices() {
  return get('/manage/offices/');
}

export function getPartnerOrganizationProfiles(id, options) {
  return authorizedGet({ uri: `/partners/${id}/org-profile`, options });
}

export function createCountryProfile(id, body) {
  return authorizedPost({ uri: `/partners/${id}/country-profile/`, body });
}

export function getPartnerVerifications(id, params, options) {
  return authorizedGet({ uri: `/partners/${id}/verifications`, params, options });
}

export function postPartnerVerifications(id, body) {
  return authorizedPost({ uri: `/partners/${id}/verifications/`, body });
}

export function patchPartnerProfileTab(partnerId, tabName, body) {
  return authorizedPatch({ uri: `/partners/${partnerId}/${tabName}/`, body });
}

export function getPartnerFlags(id, params, options) {
  return authorizedGet({ uri: `/partners/${id}/flags/`, params, options });
}

export function postPartnerFlags(id, body) {
  return authorizedPost({ uri: `/partners/${id}/flags/`, body });
}

export function patchPartnerFlags(id, body, flagId) {
  return authorizedPatch({ uri: `/partners/${id}/flags/${flagId}/`, body });
}

export function postPartnerVendorId(body) {
  return authorizedPost({ uri: '/externals/vendor-number/partner/', body });
}

export function deletePartnerVendorId(vendorId) {
  return authorizedDelete({ uri: `/externals/vendor-number/partner/${vendorId}/` });
}

export function patchUserProfile(body) {
  return authorizedPatch({ uri: '/accounts/me/profile/', body });
}

export function fetchPartnerUnData(agencyId, partnerId) {
  return authorizedGet({ uri: `/externals/partner-details/${agencyId}/${partnerId}/` });
}

export function sendForDecision(id) {
  return authorizedPost({ uri: `/projects/${id}/send-for-decision/` });
}

// Agencies
export function getAgencyMembers(id, params = { page_size: 100 }, options) {
  return authorizedGet({ uri: `/agencies/${id}/members`, params, options },
  );
}

export function getAgencies(params = { page_size: 100 }, options) {
  return authorizedGet({ uri: '/agencies/', params, options },
  );
}

// Dashboard
export function getDashboard(options) {
  return authorizedGet({ uri: '/dashboard/', options });
}

export function getApplicationsDecisions(options) {
  return authorizedGet({ uri: '/dashboard/applications-decisions/', options });
}

export function getApplicationsToScore(params, options) {
  return authorizedGet({ uri: '/dashboard/applications-to-score/', params, options });
}

export function getOpenCfeiDashboard(params, options) {
  return authorizedGet({ uri: '/dashboard/open-projects/', params, options });
}

export function getSubmittedCN(params, options) {
  return authorizedGet({ uri: '/dashboard/submitted-cn/', params, options });
}

export function getPendingOffers(params, options) {
  return authorizedGet({ uri: '/dashboard/pending-offers/', params, options });
}

export function getAdminOneLocations(countryCode, options) {
  return authorizedGet({ uri: '/common/admin-levels', params: countryCode, options });
}

// Reports

export function getPartnerReports(params, options) {
  return authorizedGet({ uri: '/reports/partners', params, options });
}

export function getProjectReports(params, options) {
  return authorizedGet({ uri: '/reports/projects', params, options });
}

export function getVerificationsReports(params, options) {
  return authorizedGet({ uri: '/reports/verifications-observations', params, options });
}

export function getPartnerProfileReports(params, options) {
  return authorizedGet({ uri: '/reports/partners/profile/export/xlsx', params, options });
}

export function getPartnerContactReports(params, options) {
  return authorizedGet({ uri: '/reports/partners/contact/export/xlsx', params, options });
}

export function getProjectDetailsReports(params, options) {
  return authorizedGet({ uri: '/reports/projects/details/export/xlsx', params, options });
}

export function getPartnerVerificationReports(params, options) {
  return authorizedGet({ uri: '/reports/verifications-observations/export/xlsx', params, options });
}

export function getPartnerMappingReports(params, options) {
  return authorizedGet({ uri: '/reports/partners/mapping/export/xlsx', params, options });
}

// ID portal
export function postNewUser(body) {
  return authorizedPost({ uri: '/manage/user/', body });
}

export function patchUser(id, body) {
  return authorizedPatch({ uri: `/manage/user/${id}/`, body });
}

export function getUsersList(params, options) {
  return authorizedGet({ uri: '/manage/users/', params, options });
}
