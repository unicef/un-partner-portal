export const INIT_COUNTRY_ID = -1;

const initialState = {
  columns: [
    { name: 'name', title: 'Organization\'s Legal Name' },
    { name: 'orgType', title: 'Type of Organization' },
    { name: 'conceptNote', title: 'Concept Note ID' },
    { name: 'reviewProgress', title: 'Review progress' },
    { name: 'yourScore', title: 'Your score' },
    { name: 'totalScore', title: 'Total Score' },
  ],
  preselections: [
    { id: 1,
      name: 'Partner 0',
      orgType: 'International NGO (INGO)',
      conceptNote: '22291/CN',
      verified: false,
      flagYellow: true,
      flagRed: false,
      reviewProgress: '10/10',
      yourScore: {
        total: 79,
        breakdown: [
          {
            label: 'sector expertise and experience',
            score: 29,
          },
          {
            label: 'contribusion to resources',
            score: 29,
          },
          {
            label: 'project management',
            score: 29,
          },
        ],
      },
      totalScore: 65,
    },
    { id: 2,
      name: 'Partner 1',
      orgType: 'International NGO (INGO)',
      conceptNote: '24491/CN',
      verified: true,
      flagYellow: true,
      flagRed: false,
      reviewProgress: '7/10',
      yourScore: {
        total: 79,
        breakdown: [
          {
            label: 'sector expertise and experience',
            score: 29,
          },
          {
            label: 'contribusion to resources',
            score: 29,
          },
          {
            label: 'project management',
            score: 29,
          },
        ],
      },
      totalScore: 100,
    },
    { id: 3,
      name: 'Partner 3',
      orgType: 'National NGO',
      conceptNote: '25671/CN',
      verified: true,
      flagYellow: true,
      flagRed: false,
      reviewProgress: '8/10',
      yourScore: {
        total: 79,
        breakdown: [
          {
            label: 'sector expertise and experience',
            score: 29,
          },
          {
            label: 'contribusion to resources',
            score: 29,
          },
          {
            label: 'project management',
            score: 29,
          },
        ],
      },
      totalScore: 97,
    },
    { id: 4,
      name: 'Partner 4',
      orgType: 'Academic Institution',
      conceptNote: '13561/CN',
      verified: true,
      flagYellow: true,
      flagRed: true,
      reviewProgress: '3/10',
      yourScore: {
        total: 79,
        breakdown: [
          {
            label: 'sector expertise and experience',
            score: 29,
          },
          {
            label: 'contribusion to resources',
            score: 29,
          },
          {
            label: 'project management',
            score: 29,
          },
        ],
      },
      totalScore: 85,
    },
    { id: 5,
      name: 'Partner 0',
      orgType: 'International NGO (INGO)',
      conceptNote: '13471/CN',
      verified: false,
      flagYellow: false,
      flagRed: true,
      reviewProgress: '0/10',
      yourScore: null,
      totalScore: null,
    },
  ],
};

export default function partnersPreselectedListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
