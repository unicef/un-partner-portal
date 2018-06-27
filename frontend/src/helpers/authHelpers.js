import { AGENCY_MEMBERS_POSITIONS, ROLES } from './constants';

// AGENCY
export const isUserAgency = state => state.session.role === ROLES.AGENCY;
export const isUserAgencyReader = state =>
  state.session.position === AGENCY_MEMBERS_POSITIONS.READER;
export const isUserNotAgencyReader = state =>
  state.session.position !== AGENCY_MEMBERS_POSITIONS.READER;
export const isUserAgencyEditor = state =>
  state.session.position === AGENCY_MEMBERS_POSITIONS.EDITOR;
export const isUserAgencyAdmin = state =>
  state.session.position === AGENCY_MEMBERS_POSITIONS.ADMIN;