import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';


const COUNTRY_MENU = [
  {
    value: 'ar',
    label: 'Arabic',
  },
  {
    value: 'ch',
    label: 'Chinese',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'ru',
    label: 'Russian',
  },
  {
    value: 'ot',
    label: 'Other',
  },
];


const PartnerProfileContactInfoLanguages = (props) => {
  const { readOnly } = props;

  return (<FormSection name="workingLanguages">
    <Grid item>
      <Grid container direction="row">
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="languages"
            label="Working Language(s) of your Organization"
            placeholder="Select language"
            values={COUNTRY_MENU}
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Please State"
            placeholder="Additional languages known"
            fieldName="extraLanguage"
            optional
            readOnly={readOnly}
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
  );
};


PartnerProfileContactInfoLanguages.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileContactInfoLanguages;
