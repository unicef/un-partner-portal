import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ArrayForm from '../../../arrayForm';
import SelectForm from '../../../selectForm';
import { mapSectorsToSelection } from '../../../../../store';
import AreaField from './areaField';

messages = {
  labels: {
    description: 'Description'
  }
}

const Sector = (readOnly, ...props) => (member, index, fields) => {
  const chosenSectors = fields.getAll().map(field => field.sector);
  const ownSector = fields.get(index).sector;
  const newValues = values.filter(value =>
    (ownSector === value.value) || !(chosenSectors.includes(value.value)));
  return (<SelectForm
    nameame={member}
    fields={fields}
    index={index}

    values={newValues}
    readOnly={readOnly}
    {...props}
  />
  );
};

const Area = (readOnly, ...props) => (member, index, fields) => (
  <div>
    <TextFieldForm
  label="Brief background of the project"
  fieldName="description"
  multiline
  textFieldProps={{
    multiline: true,
    inputProps: {
      maxLength: '200',
    },
  }}
  {...props}
  <AreaField
    name={member}
    disabled={!fields.get(index).sector}
    sectorId={fields.get(index).sector}
    readOnly={readOnly}
    {...props}
  />

);


const SelectionFieldArray = (props) => {
  const { sectors, readOnly, ...other } = props;
  return (
    <ArrayForm
      label="Sectors and specialization"
      limit={sectors.length}
      fieldName="specializations"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Sector(readOnly, ...other)}
      innerField={Area(readOnly, ...other)}
    />
  );
};

SelectionFieldArray.propTypes = {
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


export default SelectionFieldArray;
