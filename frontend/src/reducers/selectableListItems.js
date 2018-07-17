import R from 'ramda';

export const SAVE_ITEMS = 'SAVE_ITEMS';


export const saveSelectedItems = items => ({ type: SAVE_ITEMS, items });

const saveItems = (state, action) => {
  return R.assoc('items', action.items, state);
};

const initialState = {
  items: [],
};

export const saveSelections = selections => (dispatch) => {
  dispatch(saveSelectedItems(selections));
};

export default function selectableListReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_ITEMS: {
      return saveItems(state, action);
    }
    default:
      return state;
  }
}
