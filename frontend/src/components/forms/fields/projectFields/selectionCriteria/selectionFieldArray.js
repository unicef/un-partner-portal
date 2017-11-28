import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { formValueSelector } from 'redux-form';
import ArrayForm from '../../../arrayForm';
import CriteriaField from './criteriaField';
import TextFieldForm from '../../../textFieldForm';

import { mapSelectCriteriaToSelection } from '../../../../../store';
import WeightField from './weightField';
import { selectionCriteria } from '../../../../../helpers/validation';


const messages = {
  labels: {
    description: 'Description',
    weight: 'Weight',
  },
};

const insertWeight = (index, fields) => {
  const tempSelection = fields.get(index);
  if (!has('weight', tempSelection)) {
    const fieldsLength = fields.length;
    const isLast = index === fieldsLength - 1;
    const newWeight = Math.floor(100 / fieldsLength) + (isLast ? (100 % fieldsLength) : 0);
    fields.remove(index);
    fields.insert(index, { ...tempSelection, weight: newWeight });
  }
};

const Criteria = (criteria, readOnly, ...props) => (member, index, fields) => (<CriteriaField
  name={member}
  fields={fields}
  index={index}
  values={criteria}
  {...props}
/>);

const Description = (readOnly, form, hasWeighting, ...props) => (member, index, fields) => {
  const disabled = !fields.get(index).selection_criteria;
  if (hasWeighting) insertWeight(index, fields);
  return (<Grid container>
    <Grid item xs={12}>
      <TextFieldForm
        label={messages.labels.description}
        fieldName={`${member}.description`}
        optional
        textFieldProps={{
          multiline: true,
          inputProps: {
            maxLength: '5000',
          },
          disabled,
        }}
        {...props}
      />
    </Grid>
    {hasWeighting && <WeightField form={form} disabled={disabled} name={member} />}
  </Grid>);
};

const SelectionFieldArray = (props) => {
  const { criteria, readOnly, hasWeighting, form, ...other } = props;
  return (
    <ArrayForm
      label=""
      limit={13}
      fieldName="assessments_criteria"
      initial
      readOnly={readOnly}
      {...other}
      outerField={Criteria(criteria, readOnly, ...other)}
      innerField={Description(readOnly, form, hasWeighting, ...other)}
      validate={hasWeighting ? [selectionCriteria] : []}
    />
  );
};

SelectionFieldArray.propTypes = {
  readOnly: PropTypes.bool,
  hasWeighting: PropTypes.bool,
  criteria: PropTypes.object,
  form: PropTypes.string,
};

const selector = formValueSelector('newOpenCfei');

export default connect(
  state => ({
    criteria: mapSelectCriteriaToSelection(state),
    hasWeighting: selector(state, 'has_weighting'),
  }),
)(SelectionFieldArray);
