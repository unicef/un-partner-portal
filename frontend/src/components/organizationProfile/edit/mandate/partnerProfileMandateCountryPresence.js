import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedCountries, selectNormalizedStaffGlobalyChoices } from '../../../../store';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  operate: 'Select the countries in which the organization operates',
  staffGlobaly: 'Total number of staff globally',
  staffCountry: 'Number of staff in country',
  countryDescription: 'Briefly describe the organization\'s engagement with the communities in which you operate',
};

const PartnerProfileMandateCountryPresence = (props) => {
  const { readOnly, isCountryProfile, countries, staffGlobally } = props;

  return (
    <FormSection name="country_presence">
      <GridColumn removeNullChildren>
        {!isCountryProfile
          ? <SelectForm
            fieldName="country_presence"
            label={messages.operate}
            values={countries}
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        {!isCountryProfile
          ? <SelectForm
            fieldName="staff_globally"
            label={messages.staffGlobaly}
            values={staffGlobally}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        {isCountryProfile
          ? <SelectForm
            fieldName="staff_country"
            label={messages.staffCountry}
            values={staffGlobally}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        {isCountryProfile
          ? <TextFieldForm
            label={messages.countryDescription}
            fieldName="description"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            readOnly={readOnly}
          />
          : null}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandateCountryPresence.propTypes = {
  readOnly: PropTypes.bool,
  isCountryProfile: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  staffGlobally: PropTypes.array.isRequired,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    countries: selectNormalizedCountries(state),
    staffGlobally: selectNormalizedStaffGlobalyChoices(state),
    isCountryProfile: selector(state, 'identification.registration.hq'),
  }))(PartnerProfileMandateCountryPresence);
