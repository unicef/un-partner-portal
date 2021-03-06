import { isEmpty, isNil, pluck, sum } from 'ramda';
import { isDateBefore } from './dates';
import { COUNTRIES } from './constants';

export const EMPTY_ERROR = 'NONE';

export const required = value => ((value === undefined || value === null || isEmpty(value)) ? 'Required' : undefined);
export const requiredDate = value => ((value === undefined || value === null || isEmpty(value)) || value === 'Invalid date' ? 'Required' : undefined);
export const requiredBool = value => ((value === undefined || value === null || isEmpty(value) || !value) ? 'Required' : undefined);
export const warning = value => (isEmpty(value) || isNil(value) || (Array.isArray(value) && isNil(value[0])) ? 'Required' : undefined);
export const warningDate = value => (isEmpty(value) || isNil(value) || (Array.isArray(value) && isNil(value[0])) || value === 'Invalid date' ? 'Required' : undefined);
export const warningBool = value => (isEmpty(value) || isNil(value) || !value ? 'Required' : undefined);
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

export const sameAs = (other, errorMsg) => (value, { [other]: otherValue }) =>
  value !== otherValue ? errorMsg : undefined;

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
  if (+value < min) return `Value is too small, min: ${min}`;
  else if (+value > max) return `Value is too large, max: ${max}`;
  return undefined;
};

export const weight = (value) => {
  const numValue = Number(value);
  if (Number.isNaN(numValue)) return 'Invalid number';
  if (value < 1) return 'Value is too small, min: 1';
  return undefined;
};


export const selectionCriteria = (value) => {
  if (value) {
    const allWeights = pluck('weight', value);
    const max = 100;
    const totalWeights = sum(allWeights);
    if (totalWeights !== max) return 'Sum of all weights must be equal to 100';
  }
  return undefined;
};

export const hasLocations = (values, allValues, { optionalLocations }) => {
  let error;
  if (!isEmpty(values) && !isNil(values)) {
    values.forEach((countryObj) => {
      if (countryObj.country
          && !countryObj.locations
          && optionalLocations && !optionalLocations.includes(countryObj.country)) {
        error = EMPTY_ERROR;
      }
    });
  }

  return error;
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

export const validateReviewScores = (values, props) => {
  if (values.scores) {
    const scoresError = [];
    const weights = pluck('weight', props.criteria);
    values.scores.forEach((scoreObj, scoreIndex) => {
      const scoreError = {};
      if (+scoreObj.score < 1) scoreError.score = 'Value is too small, min: 1';
      else if (+scoreObj.score > weights[scoreIndex]) {
        scoreError.score = `Value is too large, max: ${weights[scoreIndex]}`;
      }
      scoresError[scoreIndex] = scoreError;
    });
    return { scores: scoresError };
  }
  return {};
};

export const phoneNumber = (value) => {
  if (value && !/^\+?[1-9]\d{1,14}$/.test(value.trim())) {
    return 'Invalid phone number';
  }
};
