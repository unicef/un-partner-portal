import R from 'ramda';

export const mapToSelectFieldValues = R.compose(
  R.map(item => item[1]),
  R.toPairs,
  R.mapObjIndexed((val, key) => ({ label: val, value: key })),
);

export const applicationStatuses = {
  Pre: 'Preselected',
  Rej: 'Rejected',
  Pen: 'Pending',
};

export const projectStatuses = {
  Ope: 'Open',
  Clo: 'Closed/Under Review',
  Com: 'Completed',
};
