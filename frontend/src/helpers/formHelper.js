/* eslint-disable react/prop-types */
import R from 'ramda';
import React from 'react';
import SelectField from 'material-ui-old/SelectField';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import Autosuggest from 'react-autosuggest';
import { FormControl, FormControlLabel, FormHelperText, FormLabel } from 'material-ui/Form';
import Attachment from 'material-ui-icons/Attachment';
import DateRange from 'material-ui-icons/DateRange';
import DatePicker from 'material-ui-old/DatePicker';
import Typography from 'material-ui/Typography';
import RadioGroupRow from '../components/common/radio/radioGroupRow';
import RadioHeight from '../components/common/radio/radioHeight';
import { formatDateForPrint } from './dates';
import { numerical } from '../helpers/validation';
import {
  renderInput,
  renderMultipleInput,
  renderSuggestion,
  renderSuggestionsContainer,
} from '../components/forms/autocompleteHelpers/autocompleteRenders';
import {
  getSuggestionValue,
  setSuggestionValue,
  setMultipleSuggestionValue,
  handleClear,
} from '../components/forms//autocompleteHelpers/autocompleteFunctions';

export const fileNameFromUrl = (url) => {
  if (url) {
    return url.split('/').pop();
  }

  return '-';
};

export const BOOL_VAL = [
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No',
  },
];

const transformBool = (value) => {
  if (typeof (value) === 'boolean' && value || value === 'true') {
    return BOOL_VAL[0].value;
  } else if (typeof (value) === 'boolean' && !value || value === 'false') {
    return BOOL_VAL[1].value;
  }

  return value;
};

const convertBool = (value) => {
  if (typeof (value) === 'boolean' && value || value === 'true') {
    return BOOL_VAL[0].label;
  } else if (typeof (value) === 'boolean' && !value || value === 'false') {
    return BOOL_VAL[1].label;
  }

  return value;
};

export const visibleIfNo = (value) => {
  if (value === BOOL_VAL[1].value || (typeof (value) === 'boolean' && !value)) { return true; }

  return false;
};


export const visibleIfYes = (value) => {
  if (value === BOOL_VAL[0].value || (typeof (value) === 'boolean' && value)) { return true; }

  return false;
};

export const renderFormControlWithLabel = ({
  className,
  label,
  meta: { touched, error, warning },
  input,
  ...other
}) => (
  <div>
    <FormLabel>{label}</FormLabel>
    <FormControl
      className={className}
      {...input}
      {...other}
    />
    {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
  </div>
);

export const renderFormControl = ({
  className,
  label,
  meta: { touched, error, warning },
  input,
  ...other
}) => (
  <div>
    <FormControl
      className={className}
      {...input}
      {...other}
    />
    {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
  </div>
);

export const renderSelectField = ({
  input,
  defaultValue,
  meta: { touched, error, warning },
  children,
  ...other
}) => (
  <SelectField
    errorText={(touched && error) || error || warning}
    {...input}
    value={input.value || defaultValue}
    onChange={(event, index, value) => input.onChange(value)}
    {...other}
  >
    {children}
  </SelectField>
);

export const renderRadioField = ({ input,
  label,
  defaultValue,
  classes,
  meta: { touched, error, warning },
  options, ...other
}) => (
  <div>
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <RadioGroupRow
        selectedValue={!R.isEmpty(input.value) ? transformBool(input.value) : defaultValue}
        onChange={(event, value) => { input.onChange(transformBool(value)); }}
        {...other}
      >
        {options.map((value, index) => (
          <FormControlLabel
            className={classes.padding}
            key={index}
            value={value.value}
            control={<RadioHeight />}
            label={value.label}
          />))}</RadioGroupRow>
    </FormControl>
    {((touched && error) || warning) &&
    <FormHelperText error>{error || warning}</FormHelperText>}
  </div>);

export const renderCheckbox = ({
  name,
  disabled,
  label,
  meta: { touched, error, warning },
  input,
}) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox
        id={name}
        disabled={disabled}
        checked={input.value}
        onChange={(event, value) => { input.onChange(transformBool(value)); }}
      />
      <Typography color="inherit" type="caption">
        {label}
      </Typography>
    </div>
    {((touched && error) || error || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
  </div>);

export const renderFileDownload = () => ({ input, label }) => (<FormControl fullWidth>
  <FormLabel>{label}</FormLabel>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {input.value && <Attachment style={{ marginRight: 5 }} />}
    <div
      type="subheading"
      role="button"
      tabIndex={0}
      onClick={() => { window.open(input.value); }}
    >
      <Typography >
        {fileNameFromUrl(input.value)}
      </Typography>
    </div>
  </div>
</FormControl>);

export const renderTextField = ({
  name,
  className,
  meta: { touched, error, warning },
  input,
  ...other
}) => (<div>
  <TextField
    className={className}
    id={input.name}
    error={(touched && !!error) || !!warning}
    fullWidth
    {...input}
    {...other}
  />
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
    {/* show limit of characters
       {other.inputProps && other.inputProps.maxLength && 
        <FormHelperText style={{ marginLeft: 'auto' }}>
        {input.value.length}/{other.inputProps.maxLength}
        </FormHelperText>} */}
  </div>
</div>);

export const renderNumberField = ({
  name,
  className,
  meta: { touched, error, warning },
  input,
  ...other
}) => {
  const rangeError = numerical(other.inputProps.min, other.inputProps.max)(input.value);

  return (
    <div>
      <TextField
        className={className}
        id={name}
        error={(touched && !!error) || !!warning || !!rangeError}
        fullWidth
        {...input}
        {...other}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {((touched && error) || warning || rangeError) &&
          <FormHelperText error>{error || warning || rangeError}</FormHelperText>}
        {other.inputProps && other.inputProps.maxLength && <FormHelperText style={{ marginLeft: 'auto' }}>{input.value.length}/{other.inputProps.maxLength}</FormHelperText>}
      </div>
    </div>);
};

export const renderDatePicker = ({
  input,
  meta: { touched, error, warning },
  ...other
}) => (
  <div>
    <DatePicker
      errorText={(touched && error) || error || warning}
      {...input}
      onChange={(event, value) => input.onChange(value)}
      {...other}
    />
  </div>);

export const renderText = ({
  className,
  input,
  values,
  optional,
  label,
  date,
  ...other
}) => {
  let value = !R.isNil(input.value) && !R.isEmpty(input.value) ? input.value : (other.inputProps ? other.inputProps.initial : null);

  if (!value) value = '-';

  if (values) {
    value = R.filter((val) => {
      if (Array.isArray(value)) return value.includes(val.value);
      return value === val.value;
    }, values).map(matchedValue => matchedValue.label).join(', ');
  }

  if (R.isEmpty(value) || R.isNil(value)) value = !R.isNil(input.value) && !R.isEmpty(input.value) ? input.value : (other.inputProps ? other.inputProps.initial : null);
  if (date) value = formatDateForPrint(value);
  if (R.isEmpty(value) || R.isNil(value)) value = '-';

  return (
    <FormControl fullWidth>
      {label && <FormLabel>{label}</FormLabel>}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {date && <DateRange style={{
          marginRight: 5,
          width: 22,
          height: 22,
        }}
        />}
        <Typography
          className={className}
          {...other}
        >
          {value}
        </Typography>
      </div>
    </FormControl>
  );
};

export const renderBool = ({
  className,
  input,
  values,
  optional,
  label,
  ...other
}) => (
  <FormControl fullWidth>
    <FormLabel>{label}</FormLabel>
    <Typography
      className={className}
      {...other}
    >
      {convertBool(input.value) ? convertBool(input.value) : '-'}
    </Typography>
  </FormControl>
);

export const renderAutocomplete = ({
  meta: { touched, error, warning },
  input: { name, onChange: onFormChange, value: formValue, ...inputProps },
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
  overlap,
}) => (<div>
  <Autosuggest
    id={`autosuggest-${name}`}
    theme={{
      container: classes.container,
      suggestionsContainerOpen: overlap
        ? `${classes.suggestionsContainerOpen} ${classes.suggestionsContainerOpenOverlap}`
        : `${classes.suggestionsContainerOpen} ${classes.suggestionsContainerOpenExpand}`,
      suggestionsList: classes.suggestionsList,
      suggestion: classes.suggestion,
    }}
    renderInputComponent={multiple ? renderMultipleInput : renderInput}
    suggestions={suggestions}
    onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
    onSuggestionsClearRequested={handleSuggestionsClearRequested}
    renderSuggestionsContainer={renderSuggestionsContainer}
    getSuggestionValue={getSuggestionValue}
    onSuggestionSelected={multiple
      ? R.curry(setMultipleSuggestionValue)(formValue, handleChange, onFormChange, handleMultiChange)
      : R.curry(setSuggestionValue)(onFormChange)
    }
    highlightFirstSuggestion
    renderSuggestion={renderSuggestion}
    inputProps={{
      name,
      error: (touched && (!!error || !!warning)),
      label,
      type: 'text',
      placeholder,
      value: fieldValue,
      multiValues,
      onChange: handleChange,
      handleClear: R.curry(handleClear)(onFormChange, handleMultiClear),
      ...inputProps,
    }}
  />
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    {((touched && error) || error || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
  </div>
</div>);
