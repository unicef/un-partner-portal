export const INIT_COUNTRY_ID = -1;

const initialState = {
  columns: [
    { name: 'name', title: 'Organization\'s Legal Name' },
    { name: 'orgType', title: 'Type of Organization' },
    { name: 'conceptNote', title: 'Concept Note ID' },
    { name: 'status', title: 'Status' },
  ],
  applications: [
    { id: 1,
      name: 'Partner 0',
      orgType: 'International NGO (INGO)',
      conceptNote: '22291/CN',
      verified: false,
      flagYellow: true,
      flagRed: false,
      status: 'Pending',
    },
    { id: 2,
      name: 'Partner 1',
      orgType: 'International NGO (INGO)',
      conceptNote: '24491/CN',
      verified: true,
      flagYellow: true,
      flagRed: false,
      status: 'Pending',
    },
    { id: 3,
      name: 'Partner 3',
      orgType: 'National NGO',
      conceptNote: '25671/CN',
      verified: true,
      flagYellow: true,
      flagRed: false,
      status: 'Preselected',
    },
    { id: 4,
      name: 'Partner 4',
      orgType: 'Academic Institution',
      conceptNote: '13561/CN',
      verified: true,
      flagYellow: true,
      flagRed: true,
      status: 'Pending',
    },
    { id: 5,
      name: 'Partner 0',
      orgType: 'International NGO (INGO)',
      conceptNote: '13471/CN',
      verified: false,
      flagYellow: false,
      flagRed: true,
      status: 'Rejected',
    },
  ],
};

export default function agencyPartnersListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
