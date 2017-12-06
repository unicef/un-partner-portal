import React from 'react';
import { FormSection } from 'redux-form';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { selectNormalizedWorkingLanguages } from '../../../../store';

const messages = {
  workingLanguages: 'Working language(s) of your organization',
  other: 'If other, please state',
};

const PartnerProfileContactInfoLanguages = (props) => {
  const { readOnly, workingLanguages } = props;

  return (<FormSection name="working_languages">
    <Grid item>
      <Grid container direction="row">
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="working_languages"
            label={messages.workingLanguages}
            values={workingLanguages}
            selectFieldProps={{
              multiple: true,
            }}
            warn
            readOnly={readOnly}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label={messages.other}
            fieldName="working_languages_other"
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
  workingLanguages: PropTypes.array.isRequired,
};

export default connect(state => ({
  workingLanguages: selectNormalizedWorkingLanguages(state),
}))(PartnerProfileContactInfoLanguages);
