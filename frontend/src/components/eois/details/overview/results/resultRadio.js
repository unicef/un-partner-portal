import React from 'react';

import RadioForm from '../../../../forms/radioForm';

const confirmValues = [
  {
    value: true,
    label: 'Yes, I accept',
  },
  {
    value: false,
    label: 'No, I decline',
  },
];

const ResultRadio = () => (
  <RadioForm
    fieldName="confirmation"
    values={confirmValues}
  />);

export default ResultRadio;
