import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import AgencyMembersField from '../../../forms/fields/projectFields/agencyMembersFields/agencyMembersField';
import SelectForm from '../../../forms/selectForm';
import DatePickerForm from '../../../forms/datePickerForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedDirectJustification } from '../../../../store';
import { endDate } from '../../../../helpers/validation';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
  justificationFor: 'Justification for Direct Selection',
  pleaseState: 'Please state',
  explain: 'Explain your justification for Direct Selection',
  briefBackground: 'Brief background of the project',
  other: 'Other information (optional)',
  focal: 'Project / Programme Focal Point(s)',
  startDate: 'Estimated Start Date',
  endDate: 'Estimated End Date',
};

const ConvertToDirectSelectionForm = (props) => {
  const { handleSubmit, directJustifications, startDate } = props;
  console.log(startDate)
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <SelectForm
          fieldName="ds_justification_select"
          label={messages.justificationFor}
          values={directJustifications}
          selectFieldProps={{
            multiple: true,
          }}
          optional
        />
        <TextFieldForm
          fieldName="justification"
          label={messages.please}
          placeholder={messages.explain}
          textFieldProps={{
            inputProps: {
              maxLength: '200',
            },
          }}
        />
        <AgencyMembersField
          fieldName="focal_points"
          label={messages.focal}
          selectFieldProps={{
            multiple: false,
          }}
          optional
        />
        <TextFieldForm
          fieldName="description"
          label={messages.briefBackground}
          textFieldProps={{
            inputProps: {
              maxLength: '200',
            },
          }}
        />
        <TextFieldForm
          fieldName="other_information"
          label={messages.other}
          textFieldProps={{
            inputProps: {
              maxLength: '200',
            },
          }}
        />

        <Grid container direction="row">
          <Grid item xs={4}>
            <DatePickerForm
              label={messages.startDate}
              fieldName="start_date"
              datePickerProps={{
                minDate: new Date(),
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <DatePickerForm
              label={messages.endDate}
              fieldName="end_date"
              datePickerProps={{
                minDate: (startDate && startDate !== 'Invalid date') ? new Date(startDate) : new Date(),
              }}
              validation={[endDate]}
            />
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </GridColumn>
    </form >
  );
};

ConvertToDirectSelectionForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  directJustifications: PropTypes.array,
  startDate: PropTypes.string,
};
const selector = formValueSelector('convertToDS');

const formConvertToDirectSelectionForm = reduxForm({
  form: 'convertToDS',
})(ConvertToDirectSelectionForm);

const mapStateToProps = state => ({
  directJustifications: selectNormalizedDirectJustification(state),
  startDate: selector(state, 'start_date'),
});

export default connect(
  mapStateToProps,
)(formConvertToDirectSelectionForm);
