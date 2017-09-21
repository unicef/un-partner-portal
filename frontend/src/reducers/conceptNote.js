import { SESSION_INIT } from './session';
import { uploadConceptNote } from '../helpers/api/api';

const initialState = {
  file: null,
};

export const uploadPartnerConceptNote = (partnerId, cn) => (dispatch) => {
  const formData = new FormData();
  formData.append('partner', partnerId);
  formData.append('cn', cn);

  return uploadConceptNote(partnerId, formData)
    .then((details) => {
      
      console.log('ok');
    })
    .catch((error) => {
      
      console.log('error');
    });
};

export default function conceptNoteReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}
