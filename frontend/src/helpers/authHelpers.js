import { AGENCY_MEMBERS_POSITIONS, PARTNER_MEMBERS_POSITIONS, ROLES } from './constants';

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

// PARTNER
export const isUserPartner = state => state.session.role === ROLES.PARTNER;
export const isUserPartnerReader = state =>
  state.session.position === PARTNER_MEMBERS_POSITIONS.READER;
export const isUserNotPartnerReader = state =>
  state.session.position !== PARTNER_MEMBERS_POSITIONS.READER;
export const isUserPartnerEditor = state =>
  state.session.position === PARTNER_MEMBERS_POSITIONS.EDITOR;
export const isUserPartnerAdmin = state => true;
// export const isUserPartnerAdmin = state =>
//   state.session.position === PARTNER_MEMBERS_POSITIONS.ADMIN;

// TODO; Refactor