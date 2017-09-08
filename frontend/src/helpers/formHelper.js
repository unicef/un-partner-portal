/* eslint-disable react/prop-types */

import React from 'react';
import SelectField from 'material-ui-old/SelectField';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui-old/DatePicker';
import { FormControl, FormHelperText, FormLabel } from 'material-ui/Form';
import Typography from 'material-ui/Typography';

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
  ...other
}) => {
  if (!input.value && optional) return null;
  return (
    <FormControl fullWidth>
      <FormLabel>{label}</FormLabel>
      <Typography
        className={className}
        {...other}
      >
        {(values && values.length)
          ? values.filter((val) => {
            if (Array.isArray(input.value)) return input.value.includes(val.value);
            return input.value === val.value;
          })
            .map(matchedValue => matchedValue.label)
            .join(', ')
          : input.value}
      </Typography>
    </FormControl>
  );
};

