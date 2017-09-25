import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';
import { uploadConceptNote } from '../helpers/api/api';

export const UPLOAD_CN_STARTED = 'UPLOAD_CN_STARTED';
export const UPLOAD_CN_SUCCESS = 'UPLOAD_CN_SUCCESS';
export const UPLOAD_CN_FAILURE = 'UPLOAD_CN_FAILURE';
export const UPLOAD_CN_ENDED = 'UPLOAD_CN_ENDED';

export const uploadCnStarted = () => ({ type: UPLOAD_CN_STARTED });
export const uploadCnSuccess = response => ({ type: UPLOAD_CN_SUCCESS, response });
export const uploadCnFailure = error => ({ type: UPLOAD_CN_FAILURE, error });
export const uploadCnEnded = () => ({ type: UPLOAD_CN_ENDED });

const saveReponse = (state, response) => R.assoc('reponse', { response }, state);

const initialState = {
  loading: false,
  response: null,
  error: null,
};

export const uploadPartnerConceptNote = (projectId, cn) => (dispatch) => {
  const formData = new FormData();
  formData.append('cn', cn);

  dispatch(uploadCnStarted());

  return uploadConceptNote(projectId, formData)
    .then((response) => {
      dispatch(uploadCnSuccess(response));
      dispatch(uploadCnEnded());
    })
    .catch((error) => {
      dispatch(uploadCnFailure(error));
      dispatch(uploadCnEnded());
    });
};

export default function conceptNoteReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_CN_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case UPLOAD_CN_ENDED: {
      return stopLoading(state);
    }
    case UPLOAD_CN_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case UPLOAD_CN_SUCCESS: {
      return saveReponse(state, action);
    }
    default:
      return state;
  }
}
