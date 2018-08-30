import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';
import { clearPartnersCache } from '../../../../../reducers/cache';

class ProjectPartners extends PureComponent {
  render() {
    const { fieldName, label, values, getPartners, ...other } = this.props;

    return (
      <AutocompleteForm
        fieldName={fieldName}
        label={label}
        async
        asyncFunction={getPartners}
        multiple
        currentValues={values}
        search={'legal_name'}
        {...other}
      />
    );
  }

  componentWillUnmount() {
    this.props.clearCache();
  }
}

ProjectPartners.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  getPartners: PropTypes.func,
  disabled: PropTypes.bool,
  values: PropTypes.array,
  clearCache: PropTypes.func.isRequired,
};

ProjectPartners.defaultProps = {
  countries: [],
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
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ ...params }))
      .then(results => mapValuesForSelectionField(results)),

    clearCache: () => dispatch(clearPartnersCache()),
  }),
)(ProjectPartners);
