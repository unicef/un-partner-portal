import React, { Component } from 'react';
import { formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadAdminOne } from '../../../../reducers/adminOneLocation';
import SelectForm from '../../selectForm';

const messages = {
  label: 'Location Admin 1',
};

class Agencies extends Component {
  constructor(props) {
    super(props);
    this.state = { countryCode: null };
  }

  componentWillMount() {
    if (this.props.countryCode) {
      this.props.loadAdminOneLocations({ country_code: this.props.countryCode });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.countryCode !== nextProps.countryCode && nextProps.countryCode) {
      this.setState({ contryCode: nextProps.countryCode });
      this.props.loadAdminOneLocations({ country_code: nextProps.countryCode });
    }
  }


  render() {
    const { fieldName, label, locations, ...other } = this.props;
    let loc = locations;

    if (!locations) {
      loc = [];
    }
    return (
      <SelectForm
        fieldName={fieldName}
        label={label}
        values={locations}
        selectFieldProps={{
          disabled: !this.props.countryCode || loc.length === 0,
        }}

        {...other}
      />
    );
  }
}

Agencies.propTypes = {
  formName: PropTypes.string,
  fieldName: PropTypes.string,
  countryCode: PropTypes.string,
  observeFieldName: PropTypes.string,
  label: PropTypes.string,
  agencies: PropTypes.arrayOf(
    PropTypes.objectOf(
      {
        value: PropTypes.string,
        label: PropTypes.string,
      },
    ),
  ),
  disabled: PropTypes.bool,
  loadAdminOneLocations: PropTypes.func,
  locations: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector(ownProps.formName);
  const countryCode = selector(state, ownProps.observeFieldName);

  return {
    locations: state.adminOneLocation ? state.adminOneLocation : [],
    countryCode,
  };
};

const mapDispatch = dispatch => ({
  loadAdminOneLocations: code => dispatch(loadAdminOne(code)),
});

export default connect(mapStateToProps, mapDispatch)(Agencies);
