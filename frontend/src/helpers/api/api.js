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

function get(uri, params = {}) {
  const options = { method: 'GET', params, headers: buildHeaders() };
  return axios.get(`${host}${uri}`, options)
    .then(response => response.data);
}

function post(uri, body = {}) {
  const options = {
    headers: buildHeaders(false, { 'X-CSRFToken': getCookie('csrftoken') }),
  };
  return axios.post(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedGet({ uri, params = {} }) {
  const options = {
    params,
    headers: buildHeaders(true),
  };
  return axios.get(`${host}${uri}`, options)
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
    headers: buildHeaders(true),
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

export function uploadConceptNote(projectId, body) {
  return authorizedPostUpload({ uri: `/projects/${projectId}/partner-applications/`, body });
}

export function uploadCommonFile(body) {
  return authorizedPostUpload({ uri: '/common/file/', body });
}

export function getOpenCfeiDetails(id) {
  return authorizedGet({ uri: `/projects/${id}` });
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

export function getApplicationConceptNotes() {
  return authorizedGet({ uri: '/projects/applications/open/' });
}

export function getApplicationUnsolicitedConceptNotes() {
  return authorizedGet({ uri: '/projects/applications/unsolicited/' });
}

export function getApplicationDirect() {
  return authorizedGet({ uri: '/projects/applications/direct/' });
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


// Partners
export function getPartnerProfileDetails(partnerId) {
  return authorizedGet({ uri: `/partners/${partnerId}` });
}

export function getPartnerNames() {
  return get('/partners/short');
}

export function getPartnersList(params) {
  return authorizedGet({ uri: '/partners', params });
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

export function patchPartnerProfileTab(partnerId, tabName, body) {
  return authorizedPatch({ uri: `/partners/${partnerId}/${tabName}/`, body });
}

// Agencies
export function getAgencyMembers(id, params = { page_size: 100 }) {
  return authorizedGet({ uri: `/agencies/${id}/members`, params },
  );
}
