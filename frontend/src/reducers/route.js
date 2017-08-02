
export const ROUTE_CHANGED = 'ROUTE_CHANGED';

const initialState = {
  location: undefined,
};

export const routeChanged = location => ({ type: ROUTE_CHANGED, location });

export default function routeReducer(state = initialState, action) {
  switch (action.type) {
    case ROUTE_CHANGED: {
      return {
        location: action.location.pathname,
      };
    }
    default:
      return state;
  }
}
