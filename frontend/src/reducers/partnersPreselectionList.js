const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'type_org', title: 'Type of Organization' },
    { name: 'id', title: 'Application ID' },
    { name: 'your_score', title: 'Your score' },
    { name: 'average_total_score', title: 'Average score' },
  ],
};

export default function partnersPreselectedListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
