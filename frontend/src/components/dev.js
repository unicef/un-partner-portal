/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MuiThemeProviderLegacy from 'material-ui-old/styles/MuiThemeProvider';

import { initSession } from '../reducers/session';
import { loadCountries } from '../reducers/countries';
import getTheme, { muiOldTheme } from '../styles/muiTheme';
import TextForm from './forms/textFieldForm';
import ArrayForm from './forms/arrayForm';

const Sector = sector => {
  return (
    < TextForm
      fieldName={`${sector}.sector`}
      label="sector"
    />
  )
}
const Area = sector => (
  <TextForm
    fieldName={`${sector}.areas`}
    label="Area of Specialization"
  />
)



class Dev extends Component {

  render() {
    return (
      <div>

        <ArrayForm
          limit={15}
          fieldName="sectors"
          outerField={Sector}
          innerField={Area}
        />
      </div>

    );
  }
}


export default reduxForm({
  form: 'test',
})(Dev);