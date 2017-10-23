import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Reviewers,
} from '../../../forms/fields/projectFields/commonFields';
import { selectCfeiDetails } from '../../../../store';

const ManageReviewersForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Reviewers />
    </form >
  );
};

ManageReviewersForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const { reviewers } = selectCfeiDetails(state, ownProps.id);
  return {
    initialValues: {
      reviewers,
    },
  };
};

const formManageReviewers = reduxForm({
  form: 'manageReviewers',
})(ManageReviewersForm);

export default connect(
  mapStateToProps,
)(formManageReviewers);
