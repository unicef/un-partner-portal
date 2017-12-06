import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';
import { uploadConceptNote, deleteConceptNote, getProjectApplication } from '../helpers/api/api';
import { loadPartnerApplication } from './partnerApplicationDetails';

export const UPLOAD_CN_STARTED = 'UPLOAD_CN_STARTED';
export const UPLOAD_CN_SUCCESS = 'UPLOAD_CN_SUCCESS';
export const UPLOAD_CN_FAILURE = 'UPLOAD_CN_FAILURE';
export const UPLOAD_CN_ENDED = 'UPLOAD_CN_ENDED';
export const UPLOAD_CN_DELETED = 'UPLOAD_CN_DELETED';
export const UPLOAD_CN_CONFIRM = 'UPLOAD_CN_CONFIRM';
export const UPLOAD_CN_CLEAR_ERROR = 'UPLOAD_CN_CLEAR_ERROR';
export const UPLOAD_CN_CLEAR = 'UPLOAD_CN_CLEAR';
export const UPLOAD_CN_LOCAL_FILE = 'UPLOAD_CN_LOCAL_FILE';

export const uploadCnStarted = () => ({ type: UPLOAD_CN_STARTED });
export const uploadCnSuccess = response => ({ type: UPLOAD_CN_SUCCESS, response });
export const uploadCnFailure = error => ({ type: UPLOAD_CN_FAILURE, error });
export const uploadCnEnded = () => ({ type: UPLOAD_CN_ENDED });
export const uploadCnclearError = () => ({ type: UPLOAD_CN_CLEAR_ERROR });
export const deletedCn = () => ({ type: UPLOAD_CN_DELETED });
export const clearLocalState = () => ({ type: UPLOAD_CN_CLEAR });
export const selectLocalCnFile = file => ({ type: UPLOAD_CN_LOCAL_FILE, file });
export const confirmProfileUpdated = confirmation => ({ type: UPLOAD_CN_CONFIRM, confirmation });

const confirmProfile = (state, action) => R.assoc('confirmProfileUpdated', action.confirmation, state);

const selectFileLocal = (state, action) => R.assoc('fileSelectedLocal', action.file, state);

const clearConceptNoteState = (state) => {
  const clearCnFile = R.assoc('cnFile', null, state);
  const clearConfirm = R.assoc('confirmProfileUpdated', false, clearCnFile);
  const clearLocalFile = R.assoc('fileSelectedLocal', false, clearConfirm);
  return R.assoc('cnFile', false, clearLocalFile);
};

const saveConceptNote = (state, action) => {
  const file = R.assoc('cnFile', action.response.cn, state);
  return R.assoc('created', action.response.created, file);
};

export const deleteUploadedCn = projectId => (dispatch) => {
  debugger
  dispatch(uploadCnStarted());
  return deleteConceptNote(projectId)
    .then((response) => {
      debugger;
      dispatch(uploadCnEnded());
      dispatch(deletedCn());
    })
    .catch((error) => {
      dispatch(uploadCnFailure(error));
      dispatch(uploadCnEnded());
    });
};

export const projectApplicationExists = partnerId => (dispatch) => {
  dispatch(uploadCnStarted());
  return getProjectApplication(partnerId)
    .then((profiles) => {
      dispatch(uploadCnEnded());
      dispatch(uploadCnSuccess(profiles));
      dispatch(loadPartnerApplication(partnerId, profiles));
    })
    .catch((error) => {
      dispatch(uploadCnEnded());
    });
};

const messages = {
  uploadFailed: 'Uploaded concept note failed, please try again.',
};

const initialState = {
  loading: false,
  created: null,
  loadingApplication: false,
  cnFile: null,
  confirmProfileUpdated: false,
  fileSelectedLocal: null,
  error: { },
};

export const uploadPartnerConceptNote = (projectId, file) => (dispatch, getState) => {
  dispatch(uploadCnStarted());
  return uploadConceptNote(projectId, file)
    .then((response) => {
      dispatch(uploadCnSuccess(response));
      dispatch(uploadCnEnded());
      dispatch(loadPartnerApplication(projectId, response));
    })
    .catch((error) => {
      dispatch(uploadCnFailure(error));
      dispatch(uploadCnEnded());
    });
};

export default function conceptNoteReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_CN_FAILURE: {
      return saveErrorMsg(state, action, messages.uploadFailed);
    }
    case UPLOAD_CN_ENDED: {
      return stopLoading(state);
    }
    case UPLOAD_CN_STARTED: {
      return startLoading(clearError(state));
    }
    case UPLOAD_CN_SUCCESS: {
      return saveConceptNote(state, action);
    }
    case UPLOAD_CN_CLEAR_ERROR: {
      return clearError(state);
    }
    case UPLOAD_CN_DELETED: {
      return clearConceptNoteState(state);
    }
    case UPLOAD_CN_CONFIRM: {
      return confirmProfile(state, action);
    }
    case UPLOAD_CN_LOCAL_FILE: {
      return selectFileLocal(state, action);
    }
    case UPLOAD_CN_CLEAR: {
      return clearConceptNoteState(state);
    }
    default:
      return state;
  }
}
