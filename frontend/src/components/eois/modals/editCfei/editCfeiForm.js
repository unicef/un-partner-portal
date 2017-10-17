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
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={4} >
          <StartDate />
          <EndDate />
          <DeadlineDate />
          <NotifyDate />
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
};

const formEditCfei = reduxForm({
  form: 'editCfei',
})(EditCfeiForm);

const mapStateToProps = (state, ownProps) => {
  const { focal_points,
    start_date,
    end_date,
    deadline_date,
    notif_results_date } = selectCfeiDetails(state, ownProps.id);
  return {
    initialValues: {
      focal_points,
      start_date,
      end_date,
      deadline_date,
      notif_results_date,
    },
  };
};

export default connect(
  mapStateToProps,
)(formEditCfei);
