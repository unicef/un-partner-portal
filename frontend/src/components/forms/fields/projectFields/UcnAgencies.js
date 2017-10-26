import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../selectForm';
import { mapAgenciesNamesToSelection } from '../../../../store';
import { loadAgenciesNames } from '../../../../reducers/agencies';

const messages = {
  label: 'Agency',
};

class ProjectPartners extends Component {
  componentWillMount() {
    this.props.loadAgencies();
  }

  render() {
    const { name, agencies, ...other } = this.props;
    return (
      <SelectForm
        fieldName="agency"
        label={messages.label}
        values={agencies}
        {...other}
      />
    );
  }
}

ProjectPartners.propTypes = {
  name: PropTypes.string,
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
)(ProjectPartners);
