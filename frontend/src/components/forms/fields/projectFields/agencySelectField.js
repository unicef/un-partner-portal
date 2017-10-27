import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../selectForm';
import { mapAgenciesNamesToSelection } from '../../../../store';
import { loadAgenciesNames } from '../../../../reducers/agencies';

class AgencySelectField extends Component {
  componentWillMount() {
    this.props.loadAgencies();
  }

  render() {
    const { name, fieldName, readOnly, warn, optional, label, agencies, ...other } = this.props;
    return (
      <SelectForm
        fieldName={fieldName}
        label={label}
        readOnly={readOnly}
        values={agencies}
        optional={optional}
        warn={warn}
        {...other}
      />
    );
  }
}

AgencySelectField.propTypes = {
  name: PropTypes.string,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  warn: PropTypes.bool,
  optional: PropTypes.bool,
  agencies: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  disabled: PropTypes.bool,
  loadAgencies: PropTypes.array,
};

export default connect(
  state => ({ agencies: mapAgenciesNamesToSelection(state) }),
  dispatch => ({
    loadAgencies: () => dispatch(loadAgenciesNames()),
  }),
)(AgencySelectField);
