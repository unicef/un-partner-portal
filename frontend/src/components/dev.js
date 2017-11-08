/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui-icons/Clear';
import { FormControl, FormLabel, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from 'material-ui/styles';
import { selectNormalizedCountries } from '../store';
import TextForm from './forms/textFieldForm';
import { renderTextField, renderText } from '../helpers/formHelper';
import { required, warning } from '../helpers/validation';

const mapStateToProps = (state, ownProps) => ({
  countries: selectNormalizedCountries(state),
});

const dev = props => (<div/>);


export default reduxForm({ form: 'test' })(connect(mapStateToProps)(dev));
