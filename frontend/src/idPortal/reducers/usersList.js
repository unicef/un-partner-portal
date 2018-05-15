import R from 'ramda';

const messages = {
  loadFailed: 'Loading users failed.',
};

const initialState = {
  columns: [
    { name: 'name', title: 'Name' },
    // { name: 'office_name', title: 'Office' },
    // { name: 'role', title: 'Role' },
    { name: 'email', title: 'E-mail' },
    { name: 'status', title: 'Status' },
  ],
  loading: false,
  totalCount: 0,
  members: [],
};

export default function idPortalUsersListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
