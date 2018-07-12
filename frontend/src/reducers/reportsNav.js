
const initialState = [
  { id: 0, path: 'information', label: 'Partner Information' },
  { id: 1, path: 'management', label: 'Cfei Management' },
  { id: 2, path: 'verification', label: 'Verification & Flagging' },
];

export default function reportNavReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
