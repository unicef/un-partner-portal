export const INIT_COUNTRY_ID = -1;

const initialState = {
  columns: [
    { name: 'id', title: 'ID' },
    { name: 'project_title', title: 'Project Title', width: 200 },
    { name: 'agency', title: 'Agency' },
    { name: 'country', title: 'Country' },
    { name: 'sector', title: 'Sector' },
    { name: 'date', title: 'Application Date' },
    { name: 'direct_selection', title: 'Direct Selection' },
  ],
  notes: [
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
    { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    }, { id: 'CN/0192',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'Kenya',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: true,
    },
    { id: 'CN/0190',
      project_title: 'Teaching students new language',
      agency: 'WFP',
      country: 'Spain',
      sector: 'Education',
      date: '1 Oct 2017',
      direct_selection: false,
    },
    { id: 'CN/603',
      project_title: 'Capacity building for small rural farmers',
      agency: 'UNICEF',
      country: 'England',
      sector: 'Food Security',
      date: '30 Sep 2017',
      direct_selection: false,
    },
  ],
};

export default function applicationsUnsolicitedListReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
