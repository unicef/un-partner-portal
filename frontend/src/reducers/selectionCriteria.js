const initialState = {
  SEE: 'Sector expertise and experience',
  Pro: 'Project management',
  LEP: 'Local experience and presence',
  Con: 'Contribution of resource',
  Cos: 'Cost effectiveness',
  Exp: 'Experience working with UN',
  Rel: 'Relevance of proposal to achieving expected results',
  Cla: 'Clarity of activities and expected results',
  Inn: 'Innovative approach',
  Sus: 'Sustainability of intervention',
  Rea: 'Realistic timelines and plans',
  ASC: 'Access/security considerations',
  Oth: 'Other',
};

export default function selectionCriteriaReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
