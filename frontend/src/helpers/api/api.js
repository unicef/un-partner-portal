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
