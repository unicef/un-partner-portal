import R from 'ramda';
import { getNotifications, patchNotification, patchNotifications } from '../helpers/api/api';
import {
  clearError,
  startLoading,
  stopLoading,
  saveErrorMsg,
} from './apiStatus';

export const NOTIFICATIONS_LOAD_STARTED = 'NOTIFICATIONS_LOAD_STARTED';
export const NOTIFICATIONS_LOAD_SUCCESS = 'NOTIFICATIONS_LOAD_SUCCESS';
export const NOTIFICATIONS_LOAD_FAILURE = 'NOTIFICATIONS_LOAD_FAILURE';
export const NOTIFICATIONS_LOAD_ENDED = 'NOTIFICATIONS_LOAD_ENDED';

export const NOTIFICATION_READ = 'NOTIFICATION_READ';
export const NOTIFICATION_PATCH_STARTED = 'NOTIFICATION_PATCH_STARTED';
export const NOTIFICATION_PATCH_SUCCESS = 'NOTIFICATION_PATCH_SUCCESS';
export const NOTIFICATION_PATCH_FAILURE = 'NOTIFICATION_PATCH_FAILURE';
export const NOTIFICATION_PATCH_ENDED = 'NOTIFICATION_PATCH_ENDED';

export const startPatchLoading = (state, action) => R.assocPath(['itemsPatch', action.id, 'loading'], true, state);
export const stopPatchLoading = (state, action) => R.assocPath(['itemsPatch', action.id, 'loading'], false, state);
export const savePatchErrorMsg = (state, action, error) =>
  R.assocPath(['itemsPatch', action.id, 'error'], error, state);
export const clearPatchError = (state, action) =>
  R.assoc('itemsPatch', R.assoc(action.id, { loading: false, error: {} }, state.itemsPatch), state);

export const notificationRead = id => ({ type: NOTIFICATION_READ, id });
export const notificationPatchStarted = id => ({ type: NOTIFICATION_PATCH_STARTED, id });
export const notificationPatchSuccess = id => ({ type: NOTIFICATION_PATCH_SUCCESS, id });
export const notificationPatchFailure = (error, id) =>
  ({ type: NOTIFICATION_PATCH_FAILURE, error, id });
export const notificationPatchEnded = id => ({ type: NOTIFICATION_PATCH_ENDED, id });
export const notificationsLoadStarted = () => ({ type: NOTIFICATIONS_LOAD_STARTED });
export const notificationsLoadSuccess = response =>
  ({ type: NOTIFICATIONS_LOAD_SUCCESS, response });
export const notificationsLoadFailure = error => ({ type: NOTIFICATIONS_LOAD_FAILURE, error });
export const notificationsLoadEnded = () => ({ type: NOTIFICATIONS_LOAD_ENDED });

const saveNotifications = (state, action) => {
  const mergedItems = R.uniqBy(item => item.id, R.concat(action.response.results, state.items));
  const items = R.assoc('items', mergedItems, state);
  const next = R.assoc('next', action.response.next, items);
  return R.assoc('totalCount', action.response.count, next);
};

const removeNotification = (state, action) => {
  let filtered = [];

  if (action.id) {
    filtered = R.filter(item => item.notification.id !== action.id, state.items);
  } else {
    filtered = R.filter(item => item.did_read, state.items);
  }

  const next = R.assoc('items', filtered, state);
  return R.assoc('totalCount', action.id ? state.totalCount - 1 : 0, next);
};

const messages = {
  loadFailed: 'Load notifications failed.',
  patchFail: 'Read notification failed.',
};

const initialState = {
  next: null,
  loading: false,
  totalCount: 0,
  items: [],
  itemsPatch: {},
};

const extractNextPage = (next) => {
  if (next) {
    return next.split('page=')[1].substring(0, 1);
  }

  return null;
};

export const loadNotificationsList = loadMore => (dispatch, getState) => {
  dispatch(notificationsLoadStarted());
  let nextPage = { page_size: null };

  if (loadMore) {
    const p = extractNextPage(getState().notificationsList.next);
    nextPage = R.assoc('page', p, nextPage);
  }

  return getNotifications(nextPage)
    .then((notifications) => {
      dispatch(notificationsLoadEnded());
      dispatch(notificationsLoadSuccess(notifications));
    })
    .catch((error) => {
      dispatch(notificationsLoadEnded());
      dispatch(notificationsLoadFailure(error));
    });
};

export const readAllNotifications = () => (dispatch) => {
  dispatch(notificationsLoadStarted());

  const read = { mark_all_as_read: true };

  return patchNotifications(read)
    .then((response) => {
      dispatch(notificationPatchSuccess());
      dispatch(notificationsLoadEnded());
    })
    .catch((error) => {
      dispatch(notificationPatchEnded());
      dispatch(notificationPatchFailure(error));
    });
};

export const readNotification = id => (dispatch) => {
  dispatch(notificationPatchStarted(id));

  const read = { did_read: true };

  return patchNotification(id, read)
    .then((notifications) => {
      dispatch(notificationPatchSuccess(id));
      dispatch(notificationRead(id));
    })
    .catch((error) => {
      dispatch(notificationPatchEnded(id));
      dispatch(notificationPatchFailure(error, id));
    });
};

export default function notificationsListReducer(state = initialState, action) {
  switch (action.type) {
    case NOTIFICATIONS_LOAD_FAILURE: {
      return saveErrorMsg(state, action, messages.loadFailed);
    }
    case NOTIFICATIONS_LOAD_ENDED: {
      return stopLoading(state);
    }
    case NOTIFICATIONS_LOAD_STARTED: {
      return startLoading(clearError(state));
    }
    case NOTIFICATIONS_LOAD_SUCCESS: {
      return saveNotifications(state, action);
    }
    case NOTIFICATION_PATCH_FAILURE: {
      return savePatchErrorMsg(state, action, messages.patchFail);
    }
    case NOTIFICATION_PATCH_ENDED: {
      return stopPatchLoading(state, action);
    }
    case NOTIFICATION_PATCH_STARTED: {
      return startPatchLoading(clearPatchError(state, action), action);
    }
    case NOTIFICATION_PATCH_SUCCESS: {
      return removeNotification(state, action);
    }
    default:
      return state;
  }
}
