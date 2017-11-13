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

const messages = {
  operate: 'Select the countries in which the organization operates',
  staffGlobaly: 'Total number of staff globally',
  staffCountry: 'Number of staff in country',
  countryDescription: 'Briefly describe the organization\'s engagement with the communities in which you operate',
};

const PartnerProfileMandateCountryPresence = (props) => {
  const { readOnly, isCountryProfile, countries, profileId, staffGlobally } = props;
  return (
    <FormSection name="country_presence">
      <GridColumn removeNullChildren>
        {!isCountryProfile
          ? <CountryField
            fieldName="country_presence"
            label={messages.operate}
            initialMulti={countries}
            multiple
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
            readOnly={readOnly}
          />
          : null}
        {isCountryProfile
          ? <AddressFieldArray
            profileId={profileId}
            formName={'partnerProfile'}
            readOnly={readOnly}
            name={'mandate_mission.country_presence.location_field_offices'}
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
            fieldName="staff_in_country"
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
            fieldName="engagement_operate_desc"
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
  profileId: PropTypes.string,
  countries: PropTypes.array.isRequired,
  staffGlobally: PropTypes.array.isRequired,
};

const selector = formValueSelector('partnerProfile');

const connected = connect((state, ownProps) => {
  const partner = R.find(item => item.id === Number(ownProps.params.id), state.session.partners || state.agencyPartnersList.partners);

  return {
    isCountryProfile: partner ? partner.is_hq : false,
    countries: selector(state, 'mandate_mission.country_presence.country_presence'),
    staffGlobally: selectNormalizedStaffGlobalyChoices(state),
  };
}, null)(PartnerProfileMandateCountryPresence);

export default withRouter(connected);
