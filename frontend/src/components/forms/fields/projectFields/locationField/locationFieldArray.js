
import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, arrayPush, arrayRemove, formValueSelector, arrayRemoveAll } from 'redux-form';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import SelectForm from '../../../selectForm';
import ArrayForm from '../../../arrayForm';
import SpreadContent from '../../../../common/spreadContent';
import LocationsMap from './locationsMapField';
import LocationsCountry from './locationsCountry';


import { selectNormalizedCountries } from '../../../../../store';


const Country = formName => sector => (
  <LocationsCountry
    name={sector}
    formName={formName}
  />
);

const Locations = (formName, loaded) => (name, index) => loaded && <LocationsMap
  formName={formName}
  name={name}
  index={index}
/>;


const LocationFieldArray = (props) => {
  const { formName, readOnly, loaded, ...other } = props;
  return (<ArrayForm
    limit={230}
    initial
    fieldName="countries"
    outerField={Country(formName, ...other)}
    innerField={Locations(formName, loaded, ...other)}
    {...other}
  />);
};


const WrappedLocationFieldArray = GoogleApiWrapper({
  version: '3.exp',
  apiKey: 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo',
})(LocationFieldArray);


export default (WrappedLocationFieldArray);

