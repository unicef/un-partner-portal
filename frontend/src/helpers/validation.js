import { isDateBefore } from './dates';

export const required = value => ((value === undefined || value === null) ? 'Required' : undefined);
export const warning = value => (value || (typeof (value) === 'boolean') ? undefined : 'Missing field');
export const email = (value) => {
  if (value && value.length > 0) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? undefined
      : 'Invalid email address';
  }

  return undefined;
};

export const password = value => (
  !/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[^\s]*\s.*)$/.test(value)
    ? undefined
    : 'Invalid password'
);

export const url = (value) => {
  if (value && value.length > 0) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
      ? undefined
      : 'Url should start with http://';
  }

  return undefined;
};

export const numerical = (value) => {
  const min = 1;
  const max = 100;
  if (+value < min) return `Value is to small, min: ${min}`;
  else if (+value > max) return `Value is to large, max: ${max}`;
  return undefined;
};

export const areFieldsMissing = (fields, values) => {
  const isFieldMissing = key => values[key] === undefined;
  return Object.keys(fields).find(isFieldMissing);
};

export const endDate = (value, allValues) => {
  if (allValues.start_date) {
    if (isDateBefore(value, allValues.start_date)) return 'End date must be after start date';
  }
  return undefined;
};

export const startDate = (value, allValues) => {
  if (allValues.notif_results_date) {
    if (isDateBefore(value, allValues.notif_results_date)) return 'Start date must be after notification date';
  }
  return undefined;
};

export const notifResultsDate = (value, allValues) => {
  if (allValues.deadline_date) {
    if (isDateBefore(value, allValues.deadline_date)) return 'Notification date must be after deadline date';
  }
  return undefined;
};
