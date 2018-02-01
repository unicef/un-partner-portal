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
    this.props.loadAgencies(this.props.all);
  }

  render() {
    const { fieldName, label, agencies, agencyId, ...other } = this.props;

    return (
      <SelectForm
        fieldName={fieldName}
        label={label}
        values={agencies}
        defaultValue={`${agencyId}`}
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
  loadAgencies: PropTypes.func,
  agencyId: PropTypes.number,
  all: PropTypes.bool,
};

Agencies.defaultProps = {
  label: messages.label,
  all: false,
};

export default connect(
  state => ({
    agencies: mapAgenciesNamesToSelection(state),
    agencyId: state.session.agencyId,
  }),
  dispatch => ({
    loadAgencies: all => dispatch(loadAgenciesNames(all)),
  }),
)(Agencies);
