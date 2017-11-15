import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import {
  FocalPoint,
  StartDate,
  EndDate,
  DeadlineDate,
  NotifyDate,
} from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import { selectCfeiDetails } from '../../../../store';
import { PROJECT_TYPES } from '../../../../helpers/constants';


const EditCfeiForm = (props) => {
  const {
    handleSubmit,
    isOpen,
    formDates: {
      start_date: formStartDate,
      deadline_date: formDeadline,
      notif_results_date: formNotifDate,
    },
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={4} >
          <StartDate minDate={formNotifDate} />
          <EndDate minDate={formStartDate} />
          {isOpen && <DeadlineDate />}
          {isOpen && <NotifyDate minDate={formDeadline} />}
        </GridRow>
        <FocalPoint />
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
  isOpen: PropTypes.bool,
  formDates: PropTypes.object,
};

const formEditCfei = reduxForm({
  form: 'editCfei',
})(EditCfeiForm);

const selector = formValueSelector('editCfei');


const mapStateToProps = (state, ownProps) => {
  const isOpen = ownProps.type === PROJECT_TYPES.OPEN;
  const { focal_points,
    start_date,
    end_date,
    deadline_date,
    notif_results_date } = selectCfeiDetails(state, ownProps.id);
  let initialValues = { focal_points, start_date, end_date };
  if (isOpen) initialValues = { ...initialValues, deadline_date, notif_results_date };
  const formDates = selector(state, 'start_date', 'deadline_date', 'notif_results_date');
  return {
    isOpen,
    formDates,
    initialValues,
  };
};

export default connect(
  mapStateToProps,
)(formEditCfei);
