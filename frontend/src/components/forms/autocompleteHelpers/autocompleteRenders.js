/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormLabel } from 'material-ui/Form';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import MultipleSelectInput from '../fields/multipleSelectInput';

export function renderInput(inputProps) {
  const { name, value, label, ref, error, ...other } = inputProps;
  return (
    <FormControl fullWidth error={error}>
      <FormLabel>{label}</FormLabel>
      <TextField
        value={value}
        inputRef={ref}
        inputProps={{
          ...other,
        }}
      />
    </FormControl>
  );
}

export function renderMultipleInput(inputProps) {
  const { name, label, ref, error, ...other } = inputProps;
  return (
    <FormControl fullWidth error={error}>
      <FormLabel>{label}</FormLabel>
      <TextField
        inputProps={{
          inputRef: ref,
          ...other,
        }}
        InputProps={{
          inputComponent: MultipleSelectInput,
        }}
      />
    </FormControl>
  );
}

export function renderSuggestion(suggestion, { query, isHighlighted }) {
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
            : (<Typography key={index} style={{whiteSpace: 'pre-wrap'}}>
              {part.text}
            </Typography>)
        ))}
      </Grid>
    </MenuItem>
  );
}

export function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;
  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}
