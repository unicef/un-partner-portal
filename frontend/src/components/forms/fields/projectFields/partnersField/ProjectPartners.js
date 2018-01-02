import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AutocompleteForm from '../../../autoCompleteForm';
import { mapValuesForSelectionField } from '../../../../../store';
import { loadPartnerNamesForAutoComplete } from '../../../../../reducers/partnerNames';
import { clearPartnersCache } from '../../../../../reducers/cache';

class ProjectPartners extends PureComponent {
  render() {
    const { fieldName, label, getPartners, ...other } = this.props;

    return (
      <AutocompleteForm
        fieldName={fieldName}
        label={label}
        async
        asyncFunction={getPartners}
        multiple
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
  clearCache: PropTypes.func.isRequired,
};

ProjectPartners.defaultProps = {
  countries: [],
};

export default connect(
  null,
  dispatch => ({
    getPartners: params => dispatch(
      loadPartnerNamesForAutoComplete({ ...params }))
      .then(results => mapValuesForSelectionField(results)),

    clearCache: () => dispatch(clearPartnersCache()),
  }),
)(ProjectPartners);
