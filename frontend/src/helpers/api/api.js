import axios from 'axios';
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
  let headers = {};
  if (authorize) headers = { ...headers, Authorization: `token ${token}` };
  if (partnerId) headers = { ...headers, 'Partner-ID': partnerId };
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

export function getUserData() {
  return authorizedGet({ uri: '/accounts/me/' });
}

// Config
export function getCountries() {
  return get('/config/countries');
}

export function getSectors() {
  return get('/config/sectors');
}

// Project
export function getOpenCfei(filters) {
  return authorizedGet({ uri: '/projects/open', params: filters });
}

export function getPinnedCfei(filters) {
  return authorizedGet({ uri: '/projects/pins', params: filters });
}

export function getDirectCfei(filters) {
  return authorizedGet({ uri: '/projects/direct', params: filters });
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

export function convertCnToDirectSelection(body, id) {
  return authorizedPost({ uri: `/projects/application/${id}/convert-unsolicited/`, body });
}

export function uploadConceptNote(projectId, body) {
  return authorizedPost({ uri: `/projects/${projectId}/partner-applications/`, body });
}

export function uploadCommonFile(body) {
  return authorizedPostUpload({ uri: '/common/file/', body });
}

export function getOpenCfeiDetails(id) {
  return authorizedGet({ uri: `/projects/${id}` });
}

export function getUnsolicitedCN(params) {
  return authorizedGet({ uri: '/projects/unsolicited', params });
}

export function patchPinnedCfei(body) {
  return authorizedPatch({ uri: '/projects/pins/', body });
}

export function getCfeiReviewSummary(id) {
  return authorizedGet({ uri: `/projects/${id}/review-summary/` });
}

export function putCfeiReviewSummary(id, body) {
  return authorizedPatch({ uri: `/projects/${id}/review-summary/`, body });
}

export function getCfeiAwardedPartners(id) {
  return authorizedGet({ uri: `/projects/${id}/applications/awarded-partners/` });
}

export function getCfeiReviewers(id) {
  return authorizedGet({ uri: `/projects/${id}/applications/reviewers/` });
}

// Applications
export function getOpenCfeiApplications(id, filters) {
  return authorizedGet({ uri: `/projects/${id}/applications`, params: filters });
}

export function getProjectApplication(projectId) {
  return authorizedGet({ uri: `/projects/${projectId}/partner-application/` });
}

export function changeApplicationStatus(id, status) {
  return authorizedPatch({ uri: `/projects/application/${id}/`, body: { status } });
}

export function getApplicationDetails(id) {
  return authorizedGet({ uri: `/projects/application/${id}/` });
}

export function patchApplication(id, body) {
  return authorizedPatch({ uri: `/projects/application/${id}/`, body });
}

export function getApplicationConceptNotes(params) {
  return authorizedGet({ uri: '/projects/applications/open/', params });
}

export function getApplicationUnsolicitedConceptNotes(params) {
  return authorizedGet({ uri: '/projects/applications/unsolicited/', params });
}

export function getApplicationDirect(params) {
  return authorizedGet({ uri: '/projects/applications/direct/', params });
}

export function getApplicationReviews(applicationId) {
  return authorizedGet({ uri: `/projects/applications/${applicationId}/reviewers-status` });
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

export function getApplicationFeedback(applicationId, params) {
  return authorizedGet({
    uri: `/projects/application/${applicationId}/feedback/`,
    params });
}

export function postApplicationFeedback(applicationId, body) {
  return authorizedPost({
    uri: `/projects/application/${applicationId}/feedback/`,
    body });
}

export function postUnsolicitedCN(body) {
  return authorizedPost({ uri: '/projects/applications/unsolicited/', body });
}

export function getPartnerApplications(params) {
  return authorizedGet({ uri: '/projects/applications', params });
}

export function getApplicationComparison(id, params) {
  return authorizedGet({ uri: `/projects/${id}/applications/compare-selected/`, params });
}

// Partners
export function getPartnerProfileDetails(partnerId) {
  return authorizedGet({ uri: `/partners/${partnerId}` });
}

export function getPartnerNames(params, options) {
  return get('/partners/short', params, options);
}

export function getPartnersList(params) {
  return authorizedGet({ uri: '/partners', params });
}

export function getMembersList(id, params) {
  return authorizedGet({ uri: `/agencies/${id}/members`, params });
}

export function getNotifications(params) {
  return authorizedGet({ uri: '/notifications', params });
}

export function patchNotification(id, body) {
  return authorizedPatch({ uri: `/notifications/${id}/`, body });
}

export function patchNotifications(body) {
  return authorizedPatch({ uri: '/notifications/', body });
}

export function getPartnerProfileConfig() {
  return get('/config/partners/profile');
}

export function getPartnerOrganizationProfiles(id) {
  return authorizedGet({ uri: `/partners/${id}/org-profile` });
}

export function createCountryProfile(id, body) {
  return authorizedPost({ uri: `/partners/${id}/country-profile/`, body });
}

export function getPartnerVerifications(id) {
  return authorizedGet({ uri: `/partners/${id}/verifications` });
}

export function postPartnerVerifications(id, body) {
  return authorizedPost({ uri: `/partners/${id}/verifications/`, body });
}

export function patchPartnerProfileTab(partnerId, tabName, body) {
  return authorizedPatch({ uri: `/partners/${partnerId}/${tabName}/`, body });
}

export function getPartnerFlags(id, params) {
  return authorizedGet({ uri: `/partners/${id}/flags/`, params });
}

export function postPartnerFlags(id, body) {
  return authorizedPost({ uri: `/partners/${id}/flags/`, body });
}

export function patchPartnerFlags(id, body, flagId) {
  return authorizedPatch({ uri: `/partners/${id}/flags/${flagId}/`, body });
}


// Agencies
export function getAgencyMembers(id, params = { page_size: 100 }, options) {
  return authorizedGet({ uri: `/agencies/${id}/members`, params, options },
  );
}

export function getAgencies(params = { page_size: 100 }) {
  return authorizedGet({ uri: '/agencies/', params },
  );
}

// Dashboard
export function getDashboard() {
  return authorizedGet({ uri: '/dashboard/' });
}

export function getApplicationsDecisions() {
  return authorizedGet({ uri: '/dashboard/applications-decisions/' });
}

export function getApplicationsToScore(params) {
  return authorizedGet({ uri: '/dashboard/applications-to-score/', params });
}

export function getSubmittedCN(params) {
  return authorizedGet({ uri: '/dashboard/submitted-cn/', params });
}

export function getPendingOffers(params) {
  return authorizedGet({ uri: '/dashboard/pending-offers/', params });
}

export function getAdminOneLocations(countryCode) {
  return authorizedGet({ uri: '/common/admin-levels', params: countryCode });
}
