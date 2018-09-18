
const initialState = [
  { id: 0, path: 'overview', label: 'Overview', name: 'a' },
  { id: 1, path: 'undata', label: 'UN Data', name: 'a' },
];

export default function organizationProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
