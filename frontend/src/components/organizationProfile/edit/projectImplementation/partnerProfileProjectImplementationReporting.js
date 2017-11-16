import React from 'react';
import { formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import RadioForm from '../../../forms/radioForm';
import FileForm from '../../../forms/fileForm';
import DatePickerForm from '../../../forms/datePickerForm';
import TextFieldForm from '../../../forms/textFieldForm';
import { visibleIfYes, BOOL_VAL } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  keyResults: 'Briefly explain the key results achieved by your organization over the last year',
  publishAnnualReports: 'Does the organization publish annual reports?',
  dateOfReport: 'Date of most recent annual report',
  mostRecentReport: 'Copy of your most rescent annual report',
  link: 'Or link to the report form the organization\'s website',
};

const PartnerProfileProjectImplementationReporting = (props) => {
  const { readOnly, publishReports } = props;

  return (
    <FormSection name="report">
      <GridColumn>
        <TextFieldForm
          label={messages.keyResults}
          fieldName="key_result"
          textFieldProps={{
            multiline: true,
            inputProps: {
              maxLength: '5000',
            },
          }}
          optional
          warn
          readOnly={readOnly}
        />
        <Grid container direction="row">
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName="publish_annual_reports"
              label={messages.publishAnnualReports}
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          {visibleIfYes(publishReports)
            ? <Grid item sm={6} xs={12}>
              <DatePickerForm
                label={messages.dateOfReport}
                fieldName="last_report"
                optional
                warn
                readOnly={readOnly}
              />
            </Grid>
            : <Grid item sm={6} xs={12} />}
        </Grid>
        <Grid container direction="row">
          <Grid item sm={6} xs={12}>
            <FileForm
              formName="partnerProfile"
              sectionName="project_impl.report"
              label={messages.mostRecentReport}
              fieldName="report"
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label={messages.link}
              fieldName="link_report"
              textFieldProps={{
                multiline: true,
                inputProps: {
                  maxLength: '5000',
                },
              }}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </GridColumn>
    </FormSection>
  );
};

PartnerProfileProjectImplementationReporting.propTypes = {
  readOnly: PropTypes.bool,
  publishReports: PropTypes.bool,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    publishReports: selector(state, 'project_impl.report.publish_annual_reports'),
  }),
)(PartnerProfileProjectImplementationReporting);
