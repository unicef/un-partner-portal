import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFields } from 'redux-form';
import Grid from 'material-ui/Grid';
import TextFieldForm from '../../../textFieldForm';
import { weight } from '../../../../../helpers/validation';


const messages = {
  labels: {
    weight: 'Weight',
  },
};

class WeightField extends Component {
  componentWillUnmount() {
    this.props.clearWeight();
  }

  render() {
    const { name, disabled, ...other } = this.props;
    return (<Grid item xs={12} sm={4}>
      <TextFieldForm
        label={messages.labels.weight}
        fieldName={`${name}.weight`}
        textFieldProps={{
          InputProps: {
            inputProps: {
              min: '1',
              max: '100',
              type: 'number',
            },
          },
          disabled,
        }}
        normalize={value => +value}
        validation={[weight]}
        {...other}
      />
    </Grid>);
  }
}

WeightField.propTypes = {
  hasWeighting: PropTypes.bool,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  clearWeight: PropTypes.func,
};


export default connect(
  null,
  (dispatch, ownProps) => ({
    clearWeight: () => dispatch(clearFields(ownProps.form, false, false, `${ownProps.name}.weight`)),
  }),
)(WeightField);
