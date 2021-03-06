import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import SelectionField from '../../../forms/fields/projectFields/selectionCriteria/selectionFieldArray';
import GridColumn from '../../../common/grid/gridColumn';
import ProjectDetails from '../editDsr/ProjectDetails';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  selectionCriteria: 'Selection Criteria',
};

const EditCfeiForm = (props) => {
  const {
    handleSubmit,
    start_date,
    deadline_date,
    notif_results_date,
    clarification_request_deadline_date,
    form,
    focalPointNameArray,
    attachments,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="editCfei"
          focalPoints={focalPointNameArray}
        >
          <fields.ClarificationRequestDeadlineDate />
          <fields.DeadlineDate minDate={clarification_request_deadline_date} />
          <fields.NotifyDate minDate={notif_results_date} />
          <fields.StartDate minDate={start_date} />
          <fields.EndDate minDate={deadline_date} />
        </ProjectDetails>
        <fields.Attachments />
        <Typography type="headline">
          {messages.selectionCriteria}
        </Typography>
        <fields.Weighting />
        <SelectionField form={form} />
      </GridColumn>
    </form >
  );
};

EditCfeiForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  focalPoints: PropTypes.array,
  isOpen: PropTypes.bool,
  changeDates: PropTypes.bool,
  focalPointNameArray: PropTypes.array,
};

const selector = formValueSelector('editCfei');

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const focalPoints = cfei.focal_points_detail.map(
    item => item.id);
  const focalPointNameArray = cfei.focal_points_detail.map(
    item => item.name);

  return {
    attachments: selector(state, 'attachments'),
    initialValues: {
      title: cfei.title,
      specializations: cfei.specializations,
      focal_points: focalPoints,
      focal_points_detail: cfei.focal_points_detail,
      status: cfei.status,
      start_date: cfei.start_date,
      end_date: cfei.end_date,
      deadline_date: cfei.deadline_date,
      notif_results_date: cfei.notif_results_date,
      clarification_request_deadline_date: cfei.clarification_request_deadline_date,
      countries: cfei.locations_edit,
      description: cfei.description,
      goal: cfei.goal,
      other_information: cfei.other_information,
      has_weighting: cfei.has_weighting,
      assessments_criteria: cfei.assessments_criteria,
      attachments: cfei.attachments,
    },
    focalPointNameArray,
  };
};

const formEditCfei = reduxForm({
  form: 'editCfei',
})(EditCfeiForm);

export default connect(
  mapStateToProps,
)(formEditCfei);
