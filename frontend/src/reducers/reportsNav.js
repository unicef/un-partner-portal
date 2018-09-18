
const initialState = [
  { id: 0, path: 'information', label: 'Partners' },
  { id: 1, path: 'management', label: 'Expression of Interest' },
  { id: 2, path: 'verification', label: 'Verification & Observations' },
];

export default function reportNavReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
