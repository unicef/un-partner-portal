import R from 'ramda';
import { uploadCommonFile } from '../helpers/api/api';

const commonFile = {
  loading: false,
  fileId: null,
  fileUrl: null,
  error: { },
};

export const successLoading = (state, action) => R.assoc(action.fieldName, R.assoc('loading', true, state[action.fieldName]), state);
export const stopLoading = (state, action) => R.assoc(action.fieldName, R.assoc('loading', false, state[action.fieldName]), state);
export const saveErrorMsg = (state, action) => R.assoc(action.fieldName, R.assoc('error', { message: action.error, error: action.error }, state[action.fieldName]), state);


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
  payloadTooLarge: 'Max file size is 25 MB',
  uploadFailed: 'Upload file failed, please try again',
};

const initialState = [];

const startLoading = (state, action) => {
  const newCommonFile = R.clone(commonFile);
  return R.assoc(action.fieldName, R.assoc('loading', true, newCommonFile), state);
};

const clearFile = (state, action) => {
  const newCommonFile = R.clone(commonFile);
  return R.assoc(action.fieldName, newCommonFile, state);
};

const removeFile = (state, action) => R.dissoc(action.fieldName, state);

const saveReponse = (state, action) => {
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
      return response.id;
    })
    .catch((error) => {
      if (error && error.response && error.response.status === 413) {
        dispatch(uploadFileFailure(fieldName, messages.payloadTooLarge));
        dispatch(uploadFileEnded(fieldName));
      } else if (R.path(['response', 'data', 'file_field'], error) && !R.isEmpty(R.path(['response', 'data', 'file_field'], error))) {
        dispatch(uploadFileFailure(fieldName, R.path(['response', 'data', 'file_field'], error)[0]));
        dispatch(uploadFileEnded(fieldName));
      } else {
        dispatch(uploadFileFailure(fieldName, messages.uploadFailed));
        dispatch(uploadFileEnded(fieldName));
      }
    });
};

export default function commonFileUploadReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_FILE_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case UPLOAD_FILE_ENDED: {
      return stopLoading(state, action);
    }
    case UPLOAD_FILE_STARTED: {
      return startLoading(state, action);
    }
    case UPLOAD_FILE_SUCCESS: {
      return saveReponse(state, action);
    }
    case UPLOAD_FILE_CLEAR: {
      return clearFile(state, action);
    }
    case UPLOAD_FILE_REMOVE: {
      return removeFile(state, action);
    }
    default:
      return state;
  }
}
