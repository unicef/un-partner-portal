import React from 'react';
import { RadioGroup } from 'material-ui/Radio';
import SelectField from 'material-ui-old/SelectField';
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import { FormControl, FormHelperText} from 'material-ui/Form';


export const renderRadioGroup = ({className, label, meta:{touched, error}, input, ...other}) => {
  return (
  <RadioGroup className={className}
    {...input}
    {...other}
  />
  )
}

export const renderFormControl = ({className, label, meta:{touched, error}, input, ...other}) => {
  return (
    <div>
    <FormControl className={className}
      {...input}
      {...other}
    />
    {(touched && error) && <FormHelperText error>{error}</FormHelperText>}
    </div>
  )
}

export const renderSelectField = ({
  input,
  meta: {touched, error},
  children,
  ...custom
}) => {
  return (
  <SelectField
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
  )
}

export const renderTextField = ({name, className, meta:{touched, error}, input, ...other}) => {
  return (
  <TextField className={className}
    id={name}
    error={touched && error}
    helperText={touched && error} //hack to get error message
    fullWidth
    {...input}
    {...other}
  />
  )
}