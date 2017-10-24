import React from 'react';

import RadioForm from '../../../../forms/radioForm';

const confirmValues = [
  {
    value: true,
    label: 'I confirm',
  },
  {
    value: false,
    label: 'I decline',
  },
];

const ResultRadio = () => (
  <RadioForm
    fieldName="confirmation"
    values={confirmValues}
  />);

export default ResultRadio;
