import R from 'ramda';
import { uploadCommonFile } from '../helpers/api/api';

const commonFile = {
  loading: false,
  fileId: null,
  fileUrl: null,
  error: { },
};

export const successLoading = (action, state) => R.assoc(action.fieldName, R.assoc('loading', true, state[action.fieldName]), state);
export const stopLoading = (action, state) => R.assoc(action.fieldName, R.assoc('loading', false, state[action.fieldName]), state);
export const saveErrorMsg = (state, action, message) =>
  R.assoc(action.fieldName, R.assoc('error', { message, error: action.error }, state[action.fieldName]), state);


export const UPLOAD_FILE_STARTED = 'UPLOAD_FILE_STARTED';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE';
export const UPLOAD_FILE_ENDED = 'UPLOAD_FILE_ENDED';
export const UPLOAD_FILE_CLEAR = 'UPLOAD_FILE_CLEAR';
export const UPLOAD_FILE_REMOVE = 'UPLOAD_FILE_REMOVE';

export const uploadFileStarted = fieldName => ({ type: UPLOAD_FILE_STARTED, fieldName });
export const uploadFileSuccess = (fieldName, response) =>
  ({ type: UPLOAD_FILE_SUCCESS, fieldName, response });
export const uploadFileFailure = (fieldName, error) =>
  ({ type: UPLOAD_FILE_FAILURE, fieldName, error });
export const uploadFileEnded = fieldName => ({ type: UPLOAD_FILE_ENDED, fieldName });
export const uploadFileClear = fieldName => ({ type: UPLOAD_FILE_CLEAR, fieldName });
export const uploadFileRemove = fieldName => ({ type: UPLOAD_FILE_REMOVE, fieldName });

const messages = {
  uploadFailed: 'Uploaded file failed, please try again.',
};

const initialState = [];

const startLoading = (action, state) => {
  const newCommonFile = R.clone(commonFile);
  return R.assoc(action.fieldName, R.assoc('loading', true, newCommonFile), state);
};

const clearFile = (action, state) => {
  const newCommonFile = R.clone(commonFile);
  return R.assoc(action.fieldName, newCommonFile, state);
};

const removeFile = (action, state) => R.dissoc(action.fieldName, state);

const saveReponse = (action, state) => {
  const fileUrl = R.assoc(action.fieldName, R.assoc('fileUrl', action.response.file_field, state[action.fieldName]), state);

  return R.assoc(action.fieldName, R.assoc('fileId', action.response.id, fileUrl[action.fieldName]), fileUrl);
};

export const uploadClearFile = fieldName => (dispatch) => {
  dispatch(uploadFileClear(fieldName));
};

export const uploadRemoveFile = fieldName => (dispatch) => {
  dispatch(uploadFileRemove(fieldName));
};

export const uploadFile = (fieldName, file) => (dispatch) => {
  const formData = new FormData();
  formData.append('file_field', file);

  dispatch(uploadFileStarted(fieldName));

  return uploadCommonFile(formData)
    .then((response) => {
      dispatch(uploadFileSuccess(fieldName, response));
      dispatch(uploadFileEnded(fieldName));
    })
    .catch((error) => {
      dispatch(uploadFileFailure(fieldName, error));
      dispatch(uploadFileEnded(fieldName));
    });
};

export default function commonFileUploadReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_FILE_FAILURE: {
      return saveErrorMsg(state, action, messages.uploadFailed);
    }
    case UPLOAD_FILE_ENDED: {
      return stopLoading(action, state);
    }
    case UPLOAD_FILE_STARTED: {
      return startLoading(action, state);
    }
    case UPLOAD_FILE_SUCCESS: {
      return saveReponse(action, state);
    }
    case UPLOAD_FILE_CLEAR: {
      return clearFile(action, state);
    }
    case UPLOAD_FILE_REMOVE: {
      return removeFile(action, state);
    }
    default:
      return state;
  }
}
