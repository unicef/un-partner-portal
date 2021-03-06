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
  Rec: 'Application Recommended',
  Rev: 'Application Under Review',
};

export const projectStatuses = {
  Sen: 'Sent',
  Dra: 'Draft',
  Ope: 'Published',
  Clo: 'Closed/Under Review',
  Com: 'Finalized',
};
