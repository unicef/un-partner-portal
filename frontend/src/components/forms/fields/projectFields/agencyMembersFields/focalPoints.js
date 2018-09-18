import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadAgencyFocalPointsForAutoComplete } from '../../../../../reducers/agencyMembers';

// TODO: new version that supports autocomplete but can't be used right now
class AgencyMembersField extends Component {
  reset() {
    this._field.reset();
  }
  
  render() {
    const { members, fieldName, label, getMembers, values, ...other } = this.props;

    return (
      <AutocompleteForm
        fieldName={fieldName}
        label={label}
        innerRef={field => this._field = field}
        async
        currentValues={values}
        asyncFunction={getMembers}
        multiple
        search={'name'}
        {...other}
      />
    );
  }
}

AgencyMembersField.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  values: PropTypes.array,
  members: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  disabled: PropTypes.bool,
};

export default connect(
  (state, ownProps) => {
    let values;

    if (ownProps.formName) {
      const selector = formValueSelector(ownProps.formName);
      values = selector(state, ownProps.fieldName);
    }

    return {
      values: values || [],
    };
  },
  dispatch => ({
    getMembers: params => dispatch(loadAgencyFocalPointsForAutoComplete(params)).then(results =>
      mapValuesForSelectionField(results)),
  }),
  null,
  { withRef: true },
)(AgencyMembersField);

