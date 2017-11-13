export const INIT_COUNTRY_ID = -1;

const initialState = {
  columns: [
    { name: 'legal_name', title: 'Organization\'s Legal Name' },
    { name: 'type_org', title: 'Type of Organization' },
    { name: 'id', title: 'Application ID' },
    { name: 'review_progress', title: 'Review progress' },
    { name: 'your_score', title: 'Your score' },
    { name: 'average_total_score', title: 'Total Score' },
  ],
};

export default function partnersPreselectedListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
