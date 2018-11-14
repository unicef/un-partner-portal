/* eslint-disable react/prop-types */
import R from 'ramda';
import React, { Component } from 'react';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import Checkbox from 'material-ui/Checkbox';
import Autosuggest from 'react-autosuggest';
import { FormControl, FormControlLabel, FormHelperText, FormLabel } from 'material-ui/Form';
import Attachment from 'material-ui-icons/Attachment';
import DateRange from 'material-ui-icons/DateRange';
import DatePicker from 'material-ui-old/DatePicker';
import Typography from 'material-ui/Typography';
import RadioGroupRow from '../components/common/radio/radioGroupRow';
import RadioHeight from '../components/common/radio/radioHeight';
import FieldLabelWithTooltipIcon from '../components/common/fieldLabelWithTooltip';
import { formatDateForPrint, formatDateForDatePicker } from './dates';
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
import { RenderMultipleSelections, RenderPlaceholder } from '../components/forms/selectHelpers/selectRenderers';

export const fileNameFromUrl = (url) => {
  if (url) {
    return url.split('?')[0].split('/').pop();
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
  if (value === BOOL_VAL[1].value || typeof (value) === 'boolean' && !value) { return true; }

  return false;
};


export const visibleIfYes = (value) => {
  if (value === BOOL_VAL[0].value || typeof (value) === 'boolean' && value) { return true; }

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
  multiple,
  label,
  values,
  placeholder,
  formControlStyle,
  infoText,
  ...other
}) => {
  let valueForSelect;
  if (multiple) {
    valueForSelect = (!R.isEmpty(input.value) && input.value) || defaultValue || ['placeholder_none'];
  } else {
    valueForSelect = input.value || defaultValue || 'placeholder_none';
  }
  return (<FormControl fullWidth style={formControlStyle} error={(touched && error) || warning}>
    <FieldLabelWithTooltipIcon
      infoText={infoText}
      tooltipIconProps={{
        name: input.name,
      }}
    >
      {label}
    </FieldLabelWithTooltipIcon>
    <Select
      {...input}
      value={valueForSelect}
      multiple={multiple}
      style={{ marginTop: 0 }}
      renderValue={(value) => {
        if (value === 'placeholder_none' || R.indexOf('placeholder_none', value) !== -1) {
          return (<RenderPlaceholder placeholder={placeholder} />);
        }
        if (Array.isArray(value)) {
          const selectedValues = R.filter(
            R.propSatisfies(prop => value.includes(prop), 'value'),
            values,
          );
          return (<RenderMultipleSelections
            fieldName={input.name}
            onSelectionRemove={(removedValue) => {
              input.onChange(R.without([removedValue], value));
            }}
            selectedValues={selectedValues}
          />);
        }
        const selectedValue = R.find(R.propEq('value', value))(values) || {};
        const selectedLabel = R.prop('label', selectedValue);
        return selectedLabel;
      }}
      onBlur={(event) => {
        event.preventDefault();
      }}
      {...other}
    >
      {children}
    </Select>
    {((touched && error) || warning) && <FormHelperText>{error || warning}</FormHelperText>}
  </FormControl>);
};

export const renderRadioField = ({ input,
  label,
  defaultValue,
  classes,
  infoText,
  meta: { touched, error, warning },
  options, ...other
}) => (
    <div>
      <FormControl fullWidth>
        <FieldLabelWithTooltipIcon
          infoText={infoText}
          tooltipIconProps={{
            name: input.name,
          }}
        >
          {label}
        </FieldLabelWithTooltipIcon>
        <RadioGroupRow
          selectedValue={!R.isEmpty(input.value) ? transformBool(input.value) : defaultValue}
          onChange={(event, value) => { input.onChange(transformBool(value)); }}
          {...other}
        >
          {options.map((value, index) => (
            <FormControlLabel
              key={index}
              value={`${value.value}`}
              control={<RadioHeight />}
              label={value.label}
              disabled={value.disabled}
            />))}</RadioGroupRow>
      </FormControl>
      {((touched && error) || warning) &&
        <FormHelperText error>{error || warning}</FormHelperText>}
    </div>);

export const renderRadioFieldWithChild = ({ input,
  label,
  defaultValue,
  classes,
  disabled,
  children,
  textfield,
  infoText,
  meta: { touched, error, warning },
  options, ...other
}) => (
    <div>
      <FormControl fullWidth>
        {label && <FieldLabelWithTooltipIcon
          infoText={infoText}
          tooltipIconProps={{
            name: input.name,
          }}
        >
          {label}
        </FieldLabelWithTooltipIcon>}
        <RadioGroupRow
          selectedValue={!R.isEmpty(input.value) ? transformBool(input.value) : defaultValue}
          onChange={(event, value) => { input.onChange(transformBool(value)); }}
          {...other}
        >
          {options.map((value, index) => {
            if (value.child) {
              return (
                <div>
                  <FormControlLabel
                    key={index}
                    value={`${value.value}`}
                    control={<RadioHeight />}
                    label={value.label}
                    disabled={value.disabled || disabled}
                  />
                  <div>
                    {value.child}
                  </div>
                </div>);
            } return (
              <FormControlLabel
                key={index}
                value={`${value.value}`}
                control={<RadioHeight />}
                label={value.label}
                disabled={value.disabled || disabled}
              />);
          })}</RadioGroupRow>
      </FormControl>
      {(((touched && error) || warning) && !disabled) &&
        <FormHelperText error>{error || warning}</FormHelperText>}
    </div>);

export const renderCheckbox = ({
  name,
  disabled,
  label,
  labelType,
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
        <Typography color="inherit" type={labelType || "caption"}>
          {label}
        </Typography>
      </div>
      {((touched && error) || warning)
        && <FormHelperText error>{error || warning}</FormHelperText>}
    </div>);

export const renderFileDownload = () => ({ input, label, infoText }) => (<FormControl fullWidth>
  <FieldLabelWithTooltipIcon
    infoText={infoText}
    tooltipIconProps={{
      name: input.name,
    }}
  >
    {label}
  </FieldLabelWithTooltipIcon>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {input.value && <Attachment style={{ marginRight: 5 }} />}
    <div
      type="subheading"
      role="button"
      tabIndex={0}
      onClick={() => { window.open(input.value); }}
      style={{
        cursor: 'pointer',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }}
    >
      {fileNameFromUrl(input.value)}
    </div>
  </div>
</FormControl>);

export const renderTextField = ({
  name,
  className,
  meta: { touched, error, warning },
  input,
  label,
  infoText,
  formControlStyle,
  ...other
}) => (<FormControl fullWidth style={formControlStyle}>
  <FieldLabelWithTooltipIcon
    infoText={infoText}
    tooltipIconProps={{
      name: input.name,
    }}
  >
    {label}
  </FieldLabelWithTooltipIcon>
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
    {/* {other.InputProps.inputProps && other.InputProps.inputProps.maxLength &&
      <FormHelperText style={{ marginLeft: 'auto' }}>
      {input.value.length}/{other.InputProps.inputProps.maxLength}
      </FormHelperText>} */}
  </div>
</FormControl>);

export const renderNumberField = ({
  name,
  className,
  meta: { touched, error, warning },
  input,
  ...other
}) => {
  const rangeError = numerical(other.InputProps.inputProps.min, other.InputProps.inputProps.max)(input.value);

  return (
    <div>
      <Input
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
        {other.InputProps.inputProps && other.InputProps.inputProps.maxLength && <FormHelperText style={{ marginLeft: 'auto' }}>{input.value.length}/{other.inputProps.maxLength}</FormHelperText>}
      </div>
    </div>);
};

export const renderDatePicker = ({
  input: { value, onChange, ...inputOther },
  meta: { touched, error, warning },
  ...other
}) => {
  const datePickerProps = {};

  if (!value) {
    // noop
  } else if (typeof value === 'object' && value.valueOf()) {
    datePickerProps.value = value;
  } else if (typeof value === 'string' && value !== 'Invalid date') {
    datePickerProps.value = formatDateForDatePicker(value);
  }
  const saveValueToStore = (event, val) => {
    onChange(val);
  };

  return (
    <div>
      <DatePicker
        errorText={(touched && error) || warning}
        {...datePickerProps}
        {...inputOther}
        onChange={saveValueToStore}
        onDismiss={saveValueToStore}
        underlineStyle={{ borderColor: '#949494' }}
        {...other}
      />
    </div>
  );
};

export const renderText = ({
  className,
  input,
  values,
  optional,
  label,
  infoText,
  date,
  meta,
  multiline,
  inputProps,
  InputProps,
  ...other
}) => {
  let value = (!R.isNil(input.value) && !R.isEmpty(input.value))
    ? input.value
    : (InputProps
      ? InputProps.inputProps.initial
      : null);

  if (!value) value = '-';

  if (values) {
    value = R.filter((val) => {
      if (Array.isArray(value)) return value.includes(val.value);
      return value === val.value;
    }, values).map(matchedValue => matchedValue.label).join(', ');
  }

  if (R.isEmpty(value) || R.isNil(value)) {
    value = (!R.isNil(input.value) && !R.isEmpty(input.value))
      ? input.value
      : (InputProps
        ? InputProps.inputProps.initial
        : null);
  }
  if (date) value = formatDateForPrint(value);
  if (R.isEmpty(value) || R.isNil(value)) value = '-';

  return (
    <FormControl fullWidth>
      {label && <FieldLabelWithTooltipIcon
        infoText={infoText}
        tooltipIconProps={{
          name: input.name,
        }}
      >
        {label}
      </FieldLabelWithTooltipIcon>}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {date && <DateRange style={{
          marginRight: 5,
          width: 22,
          height: 22,
        }}
        />}
        <Typography
          className={className}
          style={{ whiteSpace: 'pre-wrap' }}
          {...other}
        >
          {Array.isArray(value) ? value.join(', ') : value}
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
  meta,
  infoText,
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

export class AutocompleteRenderer extends Component {
  componentWillReceiveProps({ input, multiple, handleChange }) {
    if (!multiple && this.props.input.value && !input.value) {
      handleChange({}, { newValue: '' });
    }
  }

  render() {
    const {
      meta: { touched, error, warning },
      input: { name, onChange: onFormChange, value: formValue, onBlur: _onBlur, ...inputProps },
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
      suggestionsPool,
      infoText,
    } = this.props;

    return (
      <div>
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
            // In some cases, the browser will continue suggesting autocompletion values even if the autocomplete
            // attribute is set to off. The trick to really enforcing non-autocompletion is to assign an invalid value
            // to the attribute.
            // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#Disabling_autocompletion
            autocomplete: 'none',
            placeholder,
            value: fieldValue,
            multiValues,
            onChange: handleChange,
            onBlur(...args) {
              if (typeof _onBlur === 'function') {
                _onBlur(...args);
              }

              if (multiple || !suggestionsPool) {
                return;
              }

              const ev = args[0];

              ev.persist();

              setTimeout(() => {
                const prevSelection = suggestionsPool.filter(s => s.value === formValue)[0];
                const newValue = prevSelection ? prevSelection.label : '';

                ev.target.value = newValue;

                handleChange(ev, { newValue });
              });
            },
            handleClear: R.curry(handleClear)(onFormChange, handleMultiClear),
            infoText,
            ...inputProps,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {((touched && error) || warning) && <FormHelperText error>{error || warning}</FormHelperText>}
        </div>
      </div>
    );
  }
}
