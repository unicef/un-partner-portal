import React from 'react';
import { pluck } from 'ramda';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import SelectionField from '../../../forms/fields/projectFields/selectionCriteria/selectionFieldArray';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import ProjectDetails from '../editDsr/ProjectDetails';
import { selectCfeiDetails } from '../../../../store';
import { PROJECT_TYPES, PROJECT_STATUSES } from '../../../../helpers/constants';

const messages = {
  selectionCriteria: 'Selection Criteria',
};

const EditCfeiForm = (props) => {
  const {
    handleSubmit,
    isOpen,
    start_date,
    deadline_date,
    notif_results_date, 
    form,
    focalPointNameArray,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="editCfei"
          focalPoints={focalPointNameArray}
        >
          <fields.DeadlineDate />
          <fields.NotifyDate minDate={notif_results_date} />
          <fields.StartDate minDate={start_date} />
          <fields.EndDate minDate={deadline_date} />
        </ProjectDetails>
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
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * type of the project, direct, open, unsolicited
   */
  focalPoints: PropTypes.array,
  isOpen: PropTypes.bool,
  changeDates: PropTypes.bool,
  focalPointNameArray: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const isOpen = ownProps.type === PROJECT_TYPES.OPEN;
  const cfei = selectCfeiDetails(state, ownProps.id);
  const focalPoints = cfei.focal_points_detail.map(
    item => item.id);
  const focalPointNameArray = cfei.focal_points_detail.map(
    item => item.name);

  return {
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
      countries: cfei.cfei_locations,
      description: cfei.description,
      goal: cfei.goal,
      has_weighting: cfei.has_weighting,
      assessments_criteria: cfei.assessments_criteria,
    },
    // focalPoints: pluck('name', focal_points_detail),
    isOpen,
    focalPointNameArray,
  };
};

const formEditCfei = reduxForm({
  form: 'editCfei',
})(EditCfeiForm);

export default connect(
  mapStateToProps,
)(formEditCfei);
