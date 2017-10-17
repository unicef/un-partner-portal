import axios from 'axios';
import store from '../../store';

const host = '/api';

function get(uri, params = {}) {
  const options = { method: 'GET', params };
  return axios.get(`${host}${uri}`, options)
    .then(response => response.data);
}

function post(uri, body = {}) {
  return axios.post(`${host}${uri}`, body)
    .then(response => response.data);
}

function authorizedGet({ uri, params = {} }) {
  const token = store.getState().session.token;
  const options = {
    params,
    headers: { Authorization: `token ${token}` },
  };
  return axios.get(`${host}${uri}`, options)
    .then(response => response.data);
}

function authorizedPost({ uri, params, body = {} }) {
  const token = store.getState().session.token;
  const options = {
    params,
    headers: { Authorization: `token ${token}` },
  };
  return axios.post(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedPatch({ uri, params, body = {} }) {
  const token = store.getState().session.token;
  const options = {
    params,
    headers: { Authorization: `token ${token}` },
  };
  return axios.patch(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedPut({ uri, params, body = {} }) {
  const token = store.getState().session.token;
  const options = {
    params,
    headers: { Authorization: `token ${token}` },
  };
  return axios.put(`${host}${uri}`, body, options)
    .then(response => response.data);
}

function authorizedPostUpload({ uri, body = {}, params }) {
  const token = store.getState().session.token;
  const options = {
    params,
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `token ${token}`,
    },
  };
  return axios.post(`${host}${uri}`, body, options)
    .then(response => response.data);
}


// Accounts
export function postRegistration(body) {
  return post('/accounts/registration/', body);
}

export function login(body) {
  return post('/rest-auth/login/', body);
}

export function getUserData() {
  return authorizedGet({ uri: '/accounts/me' });
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

export function getOpenCfeiDetails(id) {
  return authorizedGet({ uri: `/projects/${id}` });
}

export function getApplicationReviews(applicationId) {
  return authorizedGet({ uri: `/projects/applications/${applicationId}/reviewers-status` });
}

export function postApplicationReview(applicationId, reviewerId, body) {
  return authorizedPost({
    uri: `projects/applications/${applicationId}/reviewer-assessments/${reviewerId}/`,
    body });
}

export function putApplicationReview(applicationId, reviewerId, body) {
  return authorizedPut({
    uri: `projects/applications/${applicationId}/reviewer-assessments/${reviewerId}/`,
    body });
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

// Agencies
export function getAgencyMembers(id, params = { page_size: 100 }) {
  return authorizedGet({ uri: `/agencies/${id}/members`, params },
  );
}
