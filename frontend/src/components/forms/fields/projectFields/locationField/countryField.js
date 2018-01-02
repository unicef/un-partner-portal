import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { connect } from 'react-redux';
import InfoIcon from 'material-ui-icons/Info';
import SelectForm from '../../../selectForm';
import AutocompleteForm from '../../../autoCompleteForm';
import { selectNormalizedCountries } from '../../../../../store';
import TooltipIcon from '../../../../common/tooltipIcon';
import SpreadContent from '../../../../common/spreadContent';

const COUNTRY = 'Country';

const CountryField = (props) => {
  const {
    fieldName,
    label,
    suggestionsPool,
    countries,
    readOnly,
    infoText,
    initial,
    initialMultiValues,
    ...other
  } = props;

  if (!fieldName) {
    return null;
  }

  return readOnly ? (
    <SelectForm
      fieldName={fieldName}
      label={label}
      values={countries}
      readOnly={readOnly}
      textFieldProps={{
        inputProps: {
          initial,
        },
      }}
      {...other}
    />
  ) : (
    <AutocompleteForm
      fieldName={fieldName}
      label={label}
      initial={initial}
      initialMultiValues={initialMultiValues}
      suggestionsPool={suggestionsPool || countries}
      infoText={infoText}
      {...other}
    />
  );
};

CountryField.propTypes = {
  fieldName: PropTypes.string,
  countries: PropTypes.array,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  infoText: PropTypes.node,
  initial: PropTypes.string,
  suggestionsPool: PropTypes.array,
};

CountryField.defaultProps = {
  label: COUNTRY,
};

export default connect(
  (state, ownProps) => ({
    initial: state.countries[ownProps.initialValue] || '',
    initialMultiValues: ownProps.initialMulti ? R.map(
      ([, label]) => label, R.toPairs(R.pick(ownProps.initialMulti, state.countries))) : [],
    countries: selectNormalizedCountries(state),
  }),
)(CountryField);
