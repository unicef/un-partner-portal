
const initialState = {
  Sta: 'Stateless',
  Ast: 'Asylum seekers ',
  Int: 'Internally displaced persons',
  Ret: 'Returning',
  Hos: 'Host Country',
  Ref: 'Refugees',
};

export default function countriesReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
