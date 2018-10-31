import R from 'ramda';
import React from 'react';
import { FormSection, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedStaffGlobalyChoices } from '../../../../store';
import GridColumn from '../../../common/grid/gridColumn';
import CountryField from '../../../forms/fields/projectFields/locationField/countryField';
import AddressFieldArray from '../../../forms/fields/projectFields/locationField/addressFieldArray';
import { PLACEHOLDERS } from '../../../../helpers/constants';

const messages = {
  operate: 'Select the countries in which the organization operates',
  staffGlobaly: 'Total number of staff globally',
  staffCountry: 'Number of staff in country',
  countryDescription: 'Briefly describe the organization\'s engagement with the communities in which you operate',
};

const PartnerProfileMandateCountryPresence = (props) => {
  const { readOnly, locations, isCountryProfile, countries, profileId, staffGlobally } = props;

  return (
    <FormSection name="country_presence">
      <GridColumn>
        {!isCountryProfile
          ? <CountryField
            fieldName="country_presence"
            label={messages.operate}
            initialMulti={countries}
            multiple
            selectFieldProps={{
              multiple: true,
            }}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
        {isCountryProfile
          ? <AddressFieldArray
            profileId={profileId}
            formName={'partnerProfile'}
            readOnly={readOnly}
            locations={locations}
            optional
            name={'mandate_mission.country_presence.location_field_offices'}
          />
          : null}
        {!isCountryProfile
          ? <SelectForm
            fieldName="staff_globally"
            label={messages.staffGlobaly}
            values={staffGlobally}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
        {isCountryProfile
          ? <SelectForm
            fieldName="staff_in_country"
            label={messages.staffCountry}
            values={staffGlobally}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
        {isCountryProfile
          ? <TextFieldForm
            label={messages.countryDescription}
            fieldName="engagement_operate_desc"
            placeholder={PLACEHOLDERS.comment}
            textFieldProps={{
              multiline: true,
              InputProps: {
                inputProps: {
                  maxLength: '5000',
                },
              },
            }}
            warn
            optional
            readOnly={readOnly}
          />
          : null}
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileMandateCountryPresence.propTypes = {
  readOnly: PropTypes.bool,
  isCountryProfile: PropTypes.bool.isRequired,
  profileId: PropTypes.string,
  countries: PropTypes.array,
  locations: PropTypes.array,
  staffGlobally: PropTypes.array.isRequired,
};

const selector = formValueSelector('partnerProfile');

const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners
    || state.agencyPartnersList.data.partners);
  return {
    countries: selector(state, 'mandate_mission.country_presence.country_presence'),
    locations: selector(state, 'mandate_mission.country_presence.location_field_offices') || [],
    isCountryProfile: partner ? !partner.is_hq : false,
    staffGlobally: selectNormalizedStaffGlobalyChoices(state),
  };
}, null)(PartnerProfileMandateCountryPresence);

export default withRouter(connected);
