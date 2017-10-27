const initialState = {
  tabs: [
    { path: 'identification', label: 'Identification', name: 'identification' },
    { path: 'contact', label: 'Contact information', name: 'mailing' },
    { path: 'mandate', label: 'Mandate and mission', name: 'mandate_mission' },
    { path: 'funding', label: 'Funding', name: 'fund' },
    { path: 'collaboration', label: 'Collaboration', name: 'collaboration' },
    { path: 'project', label: 'Project implementation', name: 'project_impl' },
    { path: 'other', label: 'Other information', name: 'otherInformation' },
  ],
};

export default function partneProfileDetailsNavReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
