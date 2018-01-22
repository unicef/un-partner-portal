const REGISTER_HISTORY = 'REGISTER_HISTORY'

const defaultState = {
  currentPath: null,
  previousPath: null,
};

const savePath = (state, { pathname, action }) => {
  // only registrer pathname changes and ingore redirects
  if (!pathname || action === 'REPLACE') return state;
  else if (!state.currentPath) return { currentPath: pathname, previousPath: state.previousPath };
  return { currentPath: pathname, previousPath: state.currentPath };
};

export default function singleRouteHistory(state = defaultState, action) {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return savePath(state, action.payload);
    default:
      return state;
  }
}


function routesHistory(state = defaultState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

