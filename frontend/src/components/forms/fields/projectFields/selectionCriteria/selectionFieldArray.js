import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import ArrayForm from '../../../arrayForm';
import SelectForm from '../../../selectForm';
import { mapSectorsToSelection } from '../../../../../store';
import CriteriaField from './criteriaField';
import AreaField from './areaField';
import TextFieldForm from '../../../textFieldForm';


const messages = {
  labels: {
    description: 'Description',
    weight: 'Weight',
  },
};

const Sector = (readOnly, ...props) => (member, index, fields) => (<CriteriaField
  name={member}
  fields={fields}
  index={index}
  readOnly={readOnly}
  {...props}
/>
);

const Area = (readOnly, ...props) => (member, index, fields) => (
  <Grid container>
    <Grid item xs={12}>
      <TextFieldForm
        label={messages.labels.description}
        fieldName={`${member}.description`}
        disabled={!fields.get(index).display_type}
        optional
        textFieldProps={{
          multiline: true,
          inputProps: {
            maxLength: '200',
          },
          disabled: !fields.get(index).display_type,
        }}
        {...props}
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <TextFieldForm
        label={messages.labels.weight}
        fieldName={`${member}.weight`}
        textFieldProps={{
          inputProps: {
            type: 'number',
            min: '1',
            max: '100',
          },
          disabled: !fields.get(index).display_type,
        }}
        {...props}
      />
    </Grid>
  </Grid>

);


const SelectionFieldArray = (props) => {
  const { sectors, readOnly, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={13}
      fieldName="assesment_criteria"
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
