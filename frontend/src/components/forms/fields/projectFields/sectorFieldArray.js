import React from 'react';
import PropTypes from 'prop-types';

import TextForm from '../../textFieldForm';
import ArrayForm from '../../arrayForm';

const Sector = sector => (
  <TextForm
    fieldName={`${sector}.sector`}
    label="Sector"
  />
);

const Area = sector => (
  <TextForm
    fieldName={`${sector}.areas`}
    label="Area of Specialization"
  />
);

const SectorField = () => (
  <ArrayForm
    label="Sectors and specialization"
    limit={15}
    fieldName="sectors"
    outerField={Sector}
    innerField={Area}
  />
);


export default SectorField;
