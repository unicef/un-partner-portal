import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';
import SelectForm from '../../../selectForm';
import { mapSectorsToSelection } from '../../../../../store';
import AreaField from './areaField';

const Sector = (values, readOnly, ...props) => (member, index, fields) => {
  const chosenSectors = fields.getAll().map(field => field.sector);
  const ownSector = fields.get(index).sector;
  const newValues = values.filter(value =>
    (ownSector === value.value) || !(chosenSectors.includes(value.value)));
  return (<SelectForm
    fieldName={`${member}.sector`}
    label="Sector"
    values={newValues}
    readOnly={readOnly}
    {...props}
  />
  );
};

const Area = (readOnly, ...props) => (member, index, fields) => (
  <AreaField
    name={member}
    disabled={!fields.get(index).sector}
    sectorId={fields.get(index).sector}
    readOnly={readOnly}
    {...props}
  />
);


const SectorFieldArray = (props) => {
  const { sectors, readOnly, ...other } = props;
  return (
    <ArrayForm
      label="Sector(s) and area(s) of specialization"
      limit={sectors.length}
      fieldName="specializations"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Sector(sectors, readOnly, ...other)}
      innerField={Area(readOnly, ...other)}
    />
  );
};

SectorFieldArray.propTypes = {
  sectors: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  readOnly: PropTypes.bool,
};


export default connect(
  state => (
    { sectors: mapSectorsToSelection(state) }),
)(SectorFieldArray);
