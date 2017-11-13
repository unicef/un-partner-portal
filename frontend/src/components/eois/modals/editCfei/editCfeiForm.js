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
import { PROJECT_TYPES } from '../../../../helpers/constants';


const EditCfeiForm = (props) => {
  const { handleSubmit, type, focalPoints } = props;
  const isOpen = type === PROJECT_TYPES.OPEN;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={4} >
          <StartDate />
          <EndDate />
          {isOpen && <DeadlineDate />}
          {isOpen && <NotifyDate />}
        </GridRow>
        <FocalPoint initialMultiValues={focalPoints} />
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
  type: PropTypes.string,
  focalPoints: PropTypes.array,
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
    focalPoints: focal_points,
  };
};

export default connect(
  mapStateToProps,
)(formEditCfei);
