import React from 'react';
import { pluck } from 'ramda';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Reviewers,
} from '../../../forms/fields/projectFields/commonFields';
import { selectCfeiDetails } from '../../../../store';

const ManageReviewersForm = (props) => {
  const { handleSubmit, reviewers } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Reviewers initialMultiValues={reviewers} />
    </form >
  );
};

ManageReviewersForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  reviewers: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  const { reviewers, reviewers_detail } = selectCfeiDetails(state, ownProps.id);
  return {
    initialValues: {
      reviewers,
    },
    reviewers: pluck('name', reviewers_detail),
  };
};

const formManageReviewers = reduxForm({
  form: 'manageReviewers',
})(ManageReviewersForm);

export default connect(
  mapStateToProps,
)(formManageReviewers);
