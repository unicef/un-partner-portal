import R from 'ramda';

export const CHANGE_TAB = 'CHANGE_TAB';
export const ADD_INCOMPLETE_TAB = 'ADD_INCOMPLETE_TAB';
export const REMOVE_INCOMPLETE_TAB = 'REMOVE_INCOMPLETE_TAB';
export const ADD_INCOMPLETE_STEP = 'ADD_INCOMPLETE_STEP';
export const REMOVE_INCOMPLETE_STEP = 'REMOVE_INCOMPLETE_STEP';

const initialState = {
  currentTab: 0,
  incompleteTabs: [],
  incompleteSteps: [],
};

export const changeTab = newTab => ({ type: CHANGE_TAB, newTab });
export const addIncompleteTab = tabName => ({ type: ADD_INCOMPLETE_TAB, tabName });
export const removeIncompleteTab = tabName => ({ type: REMOVE_INCOMPLETE_TAB, tabName });
export const addIncompleteStep = stepName => ({ type: ADD_INCOMPLETE_STEP, stepName });
export const removeIncompleteStep = stepName => ({ type: REMOVE_INCOMPLETE_STEP, stepName });

const setCurrentTab = (state, newTab) => ({ ...state, ...{ currentTab: newTab } });

const setIncompleteTab = (state, tabName) => {
  const incompleteTabs = R.union(state.incompleteTabs, [tabName]);
  return R.assoc('incompleteTabs', incompleteTabs, state);
};

const unsetIncompleteTab = (state, tabName) => {
  const newIncompleteTabs = R.without([tabName], state.incompleteTabs);
  return R.assoc('incompleteTabs', newIncompleteTabs, state);
};

const setIncompleteStep = (state, stepName) => {
  const incompleteSteps = R.union(state.incompleteSteps, [stepName]);
  return R.assoc('incompleteSteps', incompleteSteps, state);
};

const unsetIncompleteStep = (state, stepName) => {
  const newIncompleteSteps = R.without([stepName], state.incompleteSteps);
  return R.assoc('incompleteSteps', newIncompleteSteps, state);
};


export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_TAB: {
      return setCurrentTab(state, action.newTab);
    }
    case ADD_INCOMPLETE_TAB: {
      return setIncompleteTab(state, action.tabName);
    }
    case REMOVE_INCOMPLETE_TAB: {
      return unsetIncompleteTab(state, action.tabName);
    }
    case ADD_INCOMPLETE_STEP: {
      return setIncompleteStep(state, action.stepName);
    }
    case REMOVE_INCOMPLETE_STEP: {
      return unsetIncompleteStep(state, action.stepName);
    }
    default:
      return state;
  }
}
