

const initialState = {
  tabs: [
    { path: 'notes', label: 'Concept notes for cfeis', name: 'a' },
    { path: 'unsolicited', label: 'Unsolicited concept notes', name: 'a' },
    { path: 'direct', label: 'Direct selections', name: 'a' },
  ],
};

export default function partnerApplicationsNavReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
