import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Grid from 'material-ui/Grid';
import TextFieldForm from '../../../textFieldForm';
import { weight } from '../../../../../helpers/validation';


const messages = {
  labels: {
    weight: 'Weight',
  },
};

const WeightField = (props) => {
  const { name, hasWeighting, disabled, ...other } = props;
  return (hasWeighting) ? (<Grid item xs={12} sm={4}>
    <TextFieldForm
      label={messages.labels.weight}
      fieldName={`${name}.weight`}
      textFieldProps={{
        inputProps: {
          min: '1',
          max: '100',
          type: 'number',
        },
        disabled,
      }}
      validation={[weight]}
      {...other}
    />
  </Grid>) : null;
};

WeightField.propTypes = {
  hasWeighting: PropTypes.bool,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

const selector = formValueSelector('newOpenCfei');

export default connect(
  state => ({
    hasWeighting: selector(state, 'has_weighting'),
  }),
)(WeightField);
