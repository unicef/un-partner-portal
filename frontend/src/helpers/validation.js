
export const required = value => (value ? undefined : 'Required');
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
