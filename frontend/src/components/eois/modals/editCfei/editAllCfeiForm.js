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
    formDates: {
      start_date: formStartDate,
      deadline_date: formDeadline,
      notif_results_date: formNotifDate,
    },
    focalPoints,
    changeDates,
    form,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="newOpenCfei"
          focalPoints={focalPoints}
        >
          <fields.DeadlineDate />
          <fields.NotifyDate minDate={formNotifDate} />
          <fields.StartDate minDate={formStartDate} />
          <fields.EndDate minDate={formDeadline} />
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
  formDates: PropTypes.object,
  changeDates: PropTypes.bool,
};

const formEditCfei = reduxForm({
  form: 'editCfei',
})(EditCfeiForm);

const selector = formValueSelector('editCfei');


const mapStateToProps = (state, ownProps) => {
  const isOpen = ownProps.type === PROJECT_TYPES.OPEN;

  const { focal_points,
    focal_points_detail,
    status,
    start_date,
    end_date,
    deadline_date,
    notif_results_date } = selectCfeiDetails(state, ownProps.id);
  const changeDates = status === PROJECT_STATUSES.OPE;
  let initialValues = { focal_points };
  if (changeDates) initialValues = { ...initialValues, start_date, end_date };
  if (isOpen && changeDates) initialValues = { ...initialValues, deadline_date, notif_results_date };
  const formDates = selector(state, 'start_date', 'deadline_date', 'notif_results_date');
  return {
    focalPoints: pluck('name', focal_points_detail),
    isOpen,
    formDates,
    initialValues,
    changeDates,
  };
};

export default connect(
  mapStateToProps,
)(formEditCfei);
