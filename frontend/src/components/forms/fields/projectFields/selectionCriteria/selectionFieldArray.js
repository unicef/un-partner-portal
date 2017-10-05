import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';

import ArrayForm from '../../../arrayForm';
import CriteriaField from './criteriaField';
import TextFieldForm from '../../../textFieldForm';

import { mapSelectCriteriaToSelection } from '../../../../../store';
import WeightField from './weightField';


const messages = {
  labels: {
    description: 'Description',
    weight: 'Weight',
  },
};


const Criteria = (criteria, readOnly, ...props) => (member, index, fields) => (<CriteriaField
  name={member}
  fields={fields}
  index={index}
  values={criteria}
  {...props}
/>);

const Description = (readOnly, hasWeighting, ...props) => (member, index, fields) => {
  const disabled = !fields.get(index).selection_criteria;
  return (<Grid container>
    <Grid item xs={12}>
      <TextFieldForm
        label={messages.labels.description}
        fieldName={`${member}.description`}
        optional
        textFieldProps={{
          multiline: true,
          inputProps: {
            maxLength: '200',
          },
          disabled,
        }}
        {...props}
      />
    </Grid>
    <WeightField disabled={disabled} name={member} />
  </Grid>);
};

const SelectionFieldArray = (props) => {
  const { criteria, readOnly, hasWeighting, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={13}
      fieldName="assessments_criteria.options"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Criteria(criteria, readOnly, ...other)}
      innerField={Description(readOnly, hasWeighting, ...other)}
    />
  );
};

SelectionFieldArray.propTypes = {
  readOnly: PropTypes.bool,
  hasWeighting: PropTypes.bool,
  criteria: PropTypes.object,
};

export default connect(
  state => ({
    criteria: mapSelectCriteriaToSelection(state),
  }),
)(SelectionFieldArray);
