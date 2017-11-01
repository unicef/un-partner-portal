import { AGENCY_MEMBERS_POSITIONS } from './constants';

export const isUserAgencyReader = state =>
  state.session.position === AGENCY_MEMBERS_POSITIONS.READER;
export const isUserAgencyEditor = state =>
  state.session.position === AGENCY_MEMBERS_POSITIONS.EDITOR;
export const isUserAgencyAdmin = state =>
  state.session.position === AGENCY_MEMBERS_POSITIONS.ADMIN;
