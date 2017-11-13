/* eslint-disable flowtype/require-valid-file-annotation */
/* eslint-disable react/no-array-index-key */

import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { withStyles } from 'material-ui/styles';
import { renderText, renderAutocomplete } from '../../helpers/formHelper';
import { required, warning } from '../../helpers/validation';
import { getSuggestions,
  debouncedAsyncSuggestions,
  normalizeSuggestion } from './autocompleteHelpers/autocompleteFunctions';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'inherit',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 2000,
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


class AutocompleteField extends React.Component {
  constructor(props) {
    super();
    this.state = {
      value: '',
      multiValues: props.initialMultiValues || [],
      suggestions: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSuggestionsClearRequested = this.handleSuggestionsClearRequested.bind(this);
    this.handleSuggestionsFetchRequested = this.handleSuggestionsFetchRequested.bind(this);
    this.handleMultiChange = this.handleMultiChange.bind(this);
    this.handleMultiClear = this.handleMultiClear.bind(this);
    this.parseFormValue = this.parseFormValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.multiple
      && !this.props.initial
      && nextProps.initial) {
      this.setState({ value: nextProps.initial });
    }
    if (this.props.multiple
        && this.props.initialMultiValues.length === 0
        && nextProps.initialMultiValues.length !== 0) {
      this.setState({ multiValues: nextProps.initialMultiValues });
    }
  }

  handleSuggestionsFetchRequested({ value }) {
    if (this.props.async) {
      debouncedAsyncSuggestions(value, this.props.asyncFunction).then(suggestions =>
        this.setState({ suggestions }),
      );
    } else {
      this.setState({
        suggestions: getSuggestions(value, this.props.suggestionsPool),
      });
    }
  }

  handleSuggestionsClearRequested() {
    this.setState({
      suggestions: [],
    });
  }

  handleChange(event, { newValue }) {
    this.setState({
      value: (R.prop('label', newValue) ? newValue.label : newValue),
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

  parseFormValue(suggestion) {
    // check if we want to remove value from redux
    if (R.has('clear', suggestion)) return suggestion;
    // check if it's just onBlur change not suggestion
    if (!R.prop('value', suggestion)) return null;
    if (this.props.multiple) return [suggestion.value];
    return suggestion.value;
  }

  render() {
    const { classes,
      fieldName,
      label,
      placeholder,
      readOnly,
      optional,
      validation,
      warn,
      multiple,
      textFieldProps,
    } = this.props;
    return (
      <div className={classes.root}>
        {readOnly
          ? <Field
            label={label}
            name={fieldName}
            component={renderText}
            optional={optional}
            {...textFieldProps}
          />
          : <Field
            name={fieldName}
            label={label}
            placeholder={placeholder || `Provide ${label.toLowerCase()}`}
            component={renderAutocomplete}
            validate={(optional ? [] : [required].concat(validation || []))}
            normalize={normalizeSuggestion}
            warn={warn && warning}
            classes={classes}
            parse={this.parseFormValue}
            suggestions={this.state.suggestions}
            handleSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
            handleSuggestionsClearRequested={this.handleSuggestionsClearRequested}
            handleChange={this.handleChange}
            fieldValue={this.state.value}
            multiple={multiple}
            multiValues={multiple && this.state.multiValues}
            handleMultiChange={multiple && this.handleMultiChange}
            handleMultiClear={multiple && this.handleMultiClear}
          />
        }
      </div>
    );
  }
}

AutocompleteField.propTypes = { /**
  * Name of the field used by react-form and as unique id.
  */
  fieldName: PropTypes.string.isRequired,
  /**
   * label used in field, also placeholder is built from it by adding 'Provide'
   */
  label: PropTypes.node,
  /**
   * props passed to wrapped TextField
   */
  textFieldProps: PropTypes.node,
  /**
   * unique text used as placeholder
   */
  placeholder: PropTypes.string,
  /**
   * if field is optional
   */
  optional: PropTypes.bool,
  /**
   * validations passed to field
   */
  validation: PropTypes.arrayOf(PropTypes.func),
  /**
   * validations passed to field
   */
  warn: PropTypes.bool,
  /**
   * if form should be displayed in read only state
   */
  readOnly: PropTypes.bool,
  /**
   * if field should allow multiple values
   */
  multiple: PropTypes.bool,
  /**
   * array to pick suggestions from, in sync mode
   */
  suggestionsPool: PropTypes.array,
  /**
   * whether to use async mode
   */
  async: PropTypes.bool,
  /**
   * function to get async suggestions
   */
  asyncFunction: PropTypes.func,
  /**
   * initial text value
   */
  initial: PropTypes.string,
  /**
   * initial array of multiselect values
   */
  initialMultiValues: PropTypes.array,
  classes: PropTypes.object,
};

AutocompleteField.defaultProps = {
  initialMultiValues: [],
};

export default withStyles(styles)(AutocompleteField);

