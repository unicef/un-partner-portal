import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
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

const EditCfeiForm = (props) => {
  const {
    handleSubmit,
    cfeiNotifyResultsDate,
    cfeiDeadlineDate,
    cfeiStartDate,
    cfeiEndDate,
    focalPointNameArray,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={4} >
          <DeadlineDate minDate={cfeiDeadlineDate} />
          <NotifyDate minDate={cfeiNotifyResultsDate} />
          <StartDate minDate={cfeiStartDate} />
          <EndDate minDate={cfeiEndDate} />
        </GridRow>
        <FocalPoint overlap={false} initialMultiValues={focalPointNameArray} />
      </GridColumn>
    </form >
  );
};

EditCfeiForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  focalPointNameArray: PropTypes.array,
  cfeiStartDate: PropTypes.string,
  cfeiEndDate: PropTypes.string,
  cfeiDeadlineDate: PropTypes.string,
  cfeiNotifyResultsDate: PropTypes.stirng,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const cfeiDeadlineDate = cfei.deadline_date;
  const cfeiNotifyResultsDate = cfei.notif_results_date;
  const cfeiStartDate = cfei.start_date;
  const cfeiEndDate = cfei.end_date;
  const focalPoints = cfei.focal_points_detail.map(
    item => item.id);
  const focalPointNameArray = cfei.focal_points_detail.map(
    item => item.name);

  return {
    cfeiDeadlineDate,
    cfeiNotifyResultsDate,
    focalPointNameArray,
    cfeiStartDate,
    cfeiEndDate,
    initialValues: {
      start_date: cfeiStartDate,
      end_date: cfeiEndDate,
      notif_results_date: cfeiNotifyResultsDate,
      deadline_date: cfeiDeadlineDate,
      focal_points: focalPoints,
    },
  };
};

const formEditCfei = reduxForm({
  form: 'editCfei',
})(EditCfeiForm);

export default connect(
  mapStateToProps,
)(formEditCfei);
