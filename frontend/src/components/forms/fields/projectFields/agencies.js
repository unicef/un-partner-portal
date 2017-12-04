import React, { Component } from 'react';
import { isEmpty } from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../selectForm';
import { mapAgenciesNamesToSelection } from '../../../../store';
import { loadAgenciesNames } from '../../../../reducers/agencies';

const messages = {
  label: 'Agency',
};

class Agencies extends Component {
  componentWillMount() {
    if (isEmpty(this.props.agencies)) {
      this.props.loadAgencies();
    }
  }

  render() {
    const { fieldName, label, agencies, agencyId, ...other } = this.props;

    return (
      <SelectForm
        fieldName={fieldName}
        label={label}
        values={agencies}
        defaultValue={agencyId}
        {...other}
      />
    );
  }
}

Agencies.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  agencies: PropTypes.array,
  disabled: PropTypes.bool,
  loadAgencies: PropTypes.array,
  agencyId: PropTypes.string,
};

Agencies.defaultProps = {
  label: messages.label,
};

export default connect(
  state => ({
    agencies: mapAgenciesNamesToSelection(state),
    agencyId: state.session.agencyId,
  }),
  dispatch => ({
    loadAgencies: () => dispatch(loadAgenciesNames()),
  }),
)(Agencies);
