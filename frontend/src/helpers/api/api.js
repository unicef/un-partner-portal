import axios from 'axios';


const host = '/api';

// Internal help/generic functions

function get(uri, params = {}) {
  const options = { method: 'GET', params };
  return axios.get(`${host}${uri}`, options)
    .then(response => response.data)
    .catch(console.log.error);
}

// Config
export function getCountries() {
  return get('/config/countries');
}
