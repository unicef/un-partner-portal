
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
  const { fieldName,
    label,
    suggestionsPool,
    countries,
    readOnly,
    infoIcon,
    infoText,
    initial,
    initialMultiValues,
    ...other } = props;
  return readOnly ? (
    <SelectForm
      fieldName={fieldName}
      label={label}
      values={countries}
      readOnly={readOnly}
      {...other}
    />
  ) : (
    <SpreadContent>
      <AutocompleteForm
        fieldName={fieldName}
        label={label}
        initial={initial}
        initialMultiValues={initialMultiValues}
        suggestionsPool={suggestionsPool || countries}
        {...other}
      />
      {infoIcon && (

        <TooltipIcon
          infoText={infoText}
          Icon={InfoIcon}
        />

      )}
    </SpreadContent>
  );
};

CountryField.propTypes = {
  fieldName: PropTypes.string,
  countries: PropTypes.array,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  infoIcon: PropTypes.bool,
  infoText: PropTypes.string,
  initial: PropTypes.string,
  suggestionsPool: PropTypes.array,
};

CountryField.defaultProps = {
  label: COUNTRY,
};

export default connect(
  (state, ownProps) => ({
    initial: state.countries[ownProps.initialValue],
    initialMultiValues: ownProps.initialMulti ? R.map(
      ([, label]) => label, R.toPairs(R.pick(ownProps.initialMulti, state.countries))) : [],
    countries: selectNormalizedCountries(state),
  }),
)(CountryField);

