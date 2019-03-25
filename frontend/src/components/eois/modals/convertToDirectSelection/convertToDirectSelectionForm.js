import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import FocalPoints from '../../../forms/fields/projectFields/agencyMembersFields/focalPoints';
import SelectForm from '../../../forms/selectForm';
import GridColumn from '../../../common/grid/gridColumn';
import { selectNormalizedDirectJustification } from '../../../../store';
import { StartDate, EndDate } from '../../../forms/fields/projectFields/commonFields';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
  justificationFor: 'Justification for Direct Selection/Retention',
  pleaseState: 'Justification summary',
  explain: 'Explain your justification for Direct Selection/Retention',
  briefBackground: 'Project Background',
  other: 'Other information (optional)',
  focal: 'Project / Programme Focal Point(s)',
  startDate: 'Estimated Start Date',
  endDate: 'Estimated End Date',
};

const FORM_NAME = 'convertToDS';

const ConvertToDirectSelectionForm = (props) => {
  const { handleSubmit, directJustifications, startDate } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <SelectForm
          fieldName="ds_justification_select"
          label={messages.justificationFor}
          values={directJustifications}
          multiple
        />
        <TextFieldForm
          fieldName="justification"
          label={messages.pleaseState}
          placeholder={messages.explain}
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
        />
        <FocalPoints
          fieldName="focal_points"
          label={messages.focal}
          formName={FORM_NAME}
          selectFieldProps={{
            multiple: false,
          }}
        />
        <TextFieldForm
          fieldName="description"
          label={messages.briefBackground}
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
        />
        <TextFieldForm
          fieldName="other_information"
          label={messages.other}
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '5000',
              },
            },
          }}
          optional
        />

        <Grid container direction="row">
          <Grid item xs={4}>
            <StartDate />
          </Grid>
          <Grid item xs={4}>
            <EndDate
              minDate={startDate}
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
const selector = formValueSelector(FORM_NAME);

const formConvertToDirectSelectionForm = reduxForm({
  form: FORM_NAME,
})(ConvertToDirectSelectionForm);

const mapStateToProps = state => ({
  directJustifications: selectNormalizedDirectJustification(state),
  startDate: selector(state, 'start_date'),
});

export default connect(
  mapStateToProps,
)(formConvertToDirectSelectionForm);
