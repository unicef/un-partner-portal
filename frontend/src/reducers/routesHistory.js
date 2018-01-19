

const defaultState = {
  currentPath: null,
  previousPath: null,
};

const savePath = (state, { pathname }) => {
  if (!pathname) return state;
  else if (!state.currentPath) return { currentPath: pathname, previousPath: state.previousPath };
  return { currentPath: pathname, previousPath: state.currentPath };
};

export default function routesHistory(state = defaultState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return savePath(state, action.payload);
    default:
      return state;
  }
}
