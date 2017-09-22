/* eslint-disable react/prop-types */
import R from 'ramda';
import React from 'react';
import SelectField from 'material-ui-old/SelectField';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DatePicker from 'material-ui-old/DatePicker';
import { FormControl, FormHelperText, FormLabel } from 'material-ui/Form';
import Typography from 'material-ui/Typography';
import { formatDateForPrint } from './dates';


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
  meta: { touched, error, warning },
  children,
  ...other
}) => (
  <SelectField
    errorText={(touched && error) || warning}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    {...other}
  >
    {children}
  </SelectField>
);

export const renderCheckbox = ({
  name,
  className,
  disabled,
  value,
}) => (
  <Checkbox
    className={className}
    id={name}
    disabled={disabled}
    checked={value}
  />
);

export const renderTextField = ({
  name,
  className,
  meta: { touched, error, warning },
  input,
  ...other
}) => (
  <TextField
    className={className}
    id={name}
    error={(touched && !!error) || !!warning}
    helperText={(touched && error) || warning} // hack to get error message
    fullWidth
    {...input}
    {...other}
  />
);

export const renderDatePicker = ({
  input,
  meta: { touched, error, warning },
  ...other
}) => (
  <div>
    <DatePicker
      errorText={(touched && error) || warning}
      {...input}
      onChange={(event, value) => input.onChange(value)}
      {...other}
    />
  </div>
);

export const renderText = ({
  className,
  input,
  values,
  optional,
  label,
  date,
  ...other
}) => {
  let value = input.value;
  if (!value) value = '-';
  if (values) {
    value = R.filter((val) => {
      if (Array.isArray(value)) return value.includes(val.value);
      return value === val.value;
    }, values).map(matchedValue => matchedValue.label).join(', ');
  }
  if (date) value = formatDateForPrint(value);
  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <Typography
        className={className}
        {...other}
      >
        {value}
      </Typography>
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
}) => {
  let value = 'No';
  if (input.value) value = 'Yes';

  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <Typography
        className={className}
        {...other}
      >
        {value}
      </Typography>
    </FormControl>
  );
};

