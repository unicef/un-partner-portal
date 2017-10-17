import axios from 'axios';

const host = '/api';

const authClient = axios.create({
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
});
// Internal help/generic functions

function get(uri, params = {}) {
  const options = { method: 'GET', params };
  return axios.get(`${host}${uri}`, options)
    .then(response => response.data);
}

function authorizedGet(uri, params = {}) {
  const options = { method: 'GET', params };
  return authClient.get(`${host}${uri}`, options)
    .then(response => response.data);
}

function post(uri, body = {}) {
  return axios.post(`${host}${uri}`, body)
    .then(response => response.data);
}

function authorizedPost(uri, body = {}) {
  return authClient.post(`${host}${uri}`, body)
    .then(response => response.data);
}

function authorizedPatch(uri, body = {}) {
  return authClient.patch(`${host}${uri}`, body)
    .then(response => response.data);
}

function authorizedPostUpload(uri, body = {}) {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  return authClient.post(`${host}${uri}`, body, config)
    .then(response => response.data);
}


// Accounts
export function postRegistration(body) {
  return post('/accounts/registration', body);
}

// Config
export function getCountries() {
  return get('/config/countries');
}

export function getSectors() {
  return get('/config/sectors');
}

// Project
export function getOpenCfei() {
  return authorizedGet('/projects/open');
}

export function getPinnedCfei() {
  return authorizedGet('/projects/pins');
}

export function getDirectCfei() {
  return authorizedGet('/projects/direct');
}

export function postOpenCfei(body) {
  return authorizedPost('/projects/open/', body);
}

export function postDirectCfei(body) {
  return authorizedPost('/projects/direct/', body);
}

export function uploadConceptNote(projectId, body) {
  return authorizedPostUpload(`/projects/${projectId}/partner-applications/`, body);
}

export function getOpenCfeiDetails(id) {
  return authorizedGet(`/projects/${id}`);
}

// Applications

export function getOpenCfeiApplications(id, filters) {
  return authorizedGet(`/projects/${id}/applications`, filters);
}

export function changeApplicationStatus(id, status) {
  return authorizedPatch(`/projects/application/${id}/`, { status });
}

export function getApplicationDetails(id) {
  return authorizedGet(`/projects/application/${id}/`);
}

export function getApplicationConceptNotes() {
  return authorizedGet('/projects/applications/open/');
}

export function getApplicationUnsolicitedConceptNotes() {
  return authorizedGet('/projects/applications/unsolicited/');
}

export function getApplicationDirect() {
  return authorizedGet('/projects/applications/direct/');
}

// Partners
export function getPartnerProfileDetails(partnerId) {
  return authorizedGet(`/partners/${partnerId}`);
}

export function getPartnerNames() {
  return get('/partners/short');
}

export function getPartnersList(params) {
  return authorizedGet('/partners', params);
}

export function getPartnerProfileConfig() {
  return get('/config/partners/profile');
}

