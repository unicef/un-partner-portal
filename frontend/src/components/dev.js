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

function renderInput(inputProps) {
  const { name, value, label, ref, error, ...other } = inputProps;
  return (
    <FormControl fullWidth error={error}>
      <FormLabel htmlFor={`autosuggest-input-${name}`}>{label}</FormLabel>
      <TextField
        id={`autosuggest-input-${name}`}
        value={value}
        inputRef={ref}
        inputProps={{
          ...other,
        }}
      />
    </FormControl>
  );
}

const renderInnerInputComponent = ({ multiValues, placeholder, handleClear, ...props }) => (
  <Grid container align="center" spacing={8}>
    {!R.isEmpty(multiValues)
      && multiValues.map((value, index) =>
        (<Grid item key={`${value}-${index}`}>
          <Grid container align="center" spacing={0}>
            {value}
            <IconButton color="accent" onClick={() => { handleClear(index); }}>
              <Clear />
            </IconButton>
          </Grid>
        </Grid>))}
    <Grid style={{ flex: 1 }} item>
      <input placeholder={R.isEmpty(multiValues) ? placeholder : ''} {...props} />
    </Grid>
  </Grid>
);

function renderMultipleInput(inputProps) {
  const { name, label, ref, error, ...other } = inputProps;
  return (
    <FormControl fullWidth error={error}>
      <FormLabel htmlFor={`autosuggest-input-${name}`} shrink>{label}</FormLabel>
      <TextField
        id={`autosuggest-input-${name}`}
        inputRef={ref}
        inputProps={{
          ...other,
        }}
        InputProps={{
          inputComponent: renderInnerInputComponent,
        }}
      />
    </FormControl>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  return (
    <MenuItem selected={isHighlighted} component="div">
      <Grid container>
        {parts.map((part, index) => (
          part.highlight
            ? (<Typography key={index} color="accent">
              {part.text}
            </Typography>)
            : (<Typography key={index} >
              {part.text}
            </Typography>)
        ))}
      </Grid>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(handleChange, suggestion) {
  handleChange(suggestion.value);
  return suggestion.label;
}

function getMultipleSuggestionValue(handleChange, handleMultiChange, formValue, suggestion) {
  if (!formValue) formValue = [];
  handleMultiChange(suggestion.label);
  handleChange(R.uniq(formValue.concat(suggestion.value)));
  return '';
}

function handleClear(handleFormChange, handleMultiFieldClear, formValues, indexToClear) {
  handleFormChange(formValues.filter((value, index) => index !== indexToClear));
  handleMultiFieldClear(indexToClear);
}

function getSuggestions(value, suggestionsPool) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;
  return inputLength === 0
    ? []
    : suggestionsPool.filter((suggestion) => {
      const keep =
        count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    background: 'white',
  },
  textField: {
    width: '100%',
  },
});

const renderAutosuggest = ({
  className,
  meta: { touched, error, warning },
  input: { name, onChange, value: formValue, ...inputProps },
  suggestions,
  handleSuggestionsFetchRequested,
  handleSuggestionsClearRequested,
  classes,
  label,
  placeholder,
  handleChange,
  handleMultiChange,
  handleMultiClear,
  multiValues,
  fieldValue,
  multiple,
  ...other
}) => {
  return (<div>
    <Autosuggest
      id={`autosuggest-${name}`}
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
      }}
      renderInputComponent={multiple ? renderMultipleInput : renderInput}
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={multiple
        ? R.curry(getMultipleSuggestionValue)(onChange, handleMultiChange, formValue)
        : R.curry(getSuggestionValue)(onChange)
      }
      renderSuggestion={renderSuggestion}
      inputProps={{
        name,
        error: (touched && (!!error || !!warning)),
        label,
        type: 'text',
        placeholder,
        value: fieldValue,
        multiValues,
        handleClear: R.curry(handleClear)(onChange, handleMultiClear, formValue),
        onChange: handleChange,
        ...inputProps,
      }}
    />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
    </div>
  </div>);
};

class AutosuggestFieldBase extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      multiValues: [],
      suggestions: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);
    this.handleMultiClear = this.handleMultiClear.bind(this);
  }

  handleSuggestionsFetchRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value, this.props.suggestionsPool),
    });
  }

  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  handleChange(event, { newValue }) {
    this.setState({
      value: newValue,
    });
  }

  handleMultiChange(newValue) {
    this.setState({
      multiValues: R.uniq(this.state.multiValues.concat(newValue)),
    });
  }

  handleMultiClear(indexToClear) {
    this.setState({
      multiValues: this.state.multiValues.filter((value, index) => index !== indexToClear),
    });
  }

  render() {
    const { classes, placeholder, readOnly, multiple, textFieldProps, fieldName, label, optional, validation, warn, normalize, inputComponent } = this.props;
    return (
      <div>
        {readOnly
          ? [
            <Field
              name={fieldName}
              component={renderText}
              optional={optional}
              {...textFieldProps}
            />]
          : <Field
            name={fieldName}
            label={label}
            placeholder={placeholder || `Provide ${label.toLowerCase()}`}
            component={renderAutosuggest}
            validate={(optional ? [] : [required].concat(validation || []))}
            normalize={normalize}
            warn={warn && warning}
            classes={classes}
            suggestions={this.state.suggestions}
            handleSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            handleSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            handleChange={this.handleChange}
            fieldValue={this.state.value}
            multiple={multiple}
            multiValues={this.state.multiValues}
            handleMultiChange={this.handleMultiChange}
            handleMultiClear={this.handleMultiClear}
            {...textFieldProps}
          />
        }
      </div>
    );
  }
}

const AutosuggestField = withStyles(styles)(AutosuggestFieldBase);

const mapStateToProps = (state, ownProps) => ({
  countries: selectNormalizedCountries(state),
});

const dev = props => (<form>
  <AutosuggestField
    fieldName="testField"
    label="countries"
    suggestionsPool={props.countries}
    optional
  />
  <AutosuggestField
    fieldName="testFieldMultiple"
    label="countries"
    suggestionsPool={props.countries}
    multiple
  />
</form>);


export default reduxForm({ form: 'test' })(connect(mapStateToProps)(dev));
