
const initialState = {
  tabs: [
    { path: 'overview', label: 'Overview', name: 'a' },
    { path: 'details', label: 'Profile details', name: 'a' },
    { path: 'undata', label: 'UN Data', name: 'a' },
    { path: 'verification', label: 'Verification', name: 'a' },
    { path: 'observations', label: 'Observations', name: 'a' },
    { path: 'applications', label: 'Applications', name: 'a' },
    { path: 'users', label: 'Users', name: 'a' },
  ],
};

export default function agencyPartnerProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
