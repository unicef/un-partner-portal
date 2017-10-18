
export const required = value => ((value === undefined || value === null) ? 'Required' : undefined);
export const warning = value => (value || (typeof (value) === 'boolean') ? undefined : 'Missing field');
export const email = value => (
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? undefined
    : 'Invalid email address'
);
export const password = value => (
  !/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[^\s]*\s.*)$/.test(value)
    ? undefined
    : 'Invalid password'
);

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
