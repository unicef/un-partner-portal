import axios from 'axios';

const host = '/api';
const authClient = axios.create({
  auth: {
    username: 'admin',
    password: 'Passw0rd!',
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
    .then(response => response.data)
}

function authorizedPost(uri, body = {}) {
  return authClient.post(`${host}${uri}`, body)
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
