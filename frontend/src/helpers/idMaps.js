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

export const organizationTypes = {
  CBO: 'Community Based Organization (CBO)',
  NGO: 'National NGO',
  Int: 'International NGO (INGO)',
  Aca: 'Academic Institution',
  RCC: 'Red Cross/Red Crescent Movement',
};
