import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import {
  FocalPoint, 
} from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn'; 
import { selectCfeiDetails } from '../../../../store';

const EditCFocalPointForm = (props) => {
  const {
    handleSubmit, 
    focalPointNameArray,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <FocalPoint formName="editCfei" overlap={false} initialMultiValues={focalPointNameArray} />
      </GridColumn>
    </form >
  );
};

EditCFocalPointForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  focalPointNameArray: PropTypes.array, 
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id); 
  const focalPoints = cfei.focal_points_detail.map(
    item => item.id);
  const focalPointNameArray = cfei.focal_points_detail.map(
    item => item.name);

  return { 
    focalPointNameArray, 
    initialValues: { 
      focal_points: focalPoints, 
    },
  };
};

const formformEditCFocalPoint = reduxForm({
  form: 'editCfei',
})(EditCFocalPointForm);

export default connect(
  mapStateToProps,
)(formformEditCFocalPoint);
