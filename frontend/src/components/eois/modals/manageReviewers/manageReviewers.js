import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import {
  Reviewers,
} from '../../../forms/fields/projectFields/commonFields';

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

const formManageReviewers = reduxForm({
  form: 'manageReviewers',
})(ManageReviewersForm);

export default formManageReviewers;
