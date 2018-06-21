import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import {
  FocalPoint,
  StartDate,
  EndDate,
} from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import { selectCfeiDetails } from '../../../../store';

const EditCfeiForm = (props) => {
  const {
    handleSubmit,
    cfeiStartDate,
    cfeiEndDate,
    focalPointNameArray,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={2} >
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
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const cfeiStartDate = cfei.start_date;
  const cfeiEndDate = cfei.end_date;
  const focalPoints = cfei.focal_points_detail.map(
    item => item.id);
  const focalPointNameArray = cfei.focal_points_detail.map(
    item => item.name);

  return {
    focalPointNameArray,
    cfeiStartDate,
    cfeiEndDate,
    initialValues: {
      start_date: cfeiStartDate,
      end_date: cfeiEndDate,
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
