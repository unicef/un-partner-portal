
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import GridRow from '../../../components/common/grid/gridRow';
import TextFieldForm from '../../../components/forms/textFieldForm';
import GridColumn from '../../../components/common/grid/gridColumn';
import { email } from '../../../helpers/validation';
import RoleField from './roleField';

const messages = {
  formName: 'newUserForm',
  selectPartners: 'Select Partners',
  selectionCriteria: 'Selection Criteria',
  firstName: 'First name',
  lastName: 'Last name',
  email: 'E-mail',
};

const NewUserForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={2} >
          <TextFieldForm
            label={messages.firstName}
            fieldName="first_name"
          />
          <TextFieldForm
            label={messages.firstName}
            fieldName="last_name"
          />
        </GridRow>
        <TextFieldForm
          label={messages.email}
          fieldName="email"
          validation={[email]}
        />
        <RoleField formName="newUserForm" />
      </GridColumn>
    </form >
  );
};

NewUserForm.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'newUserForm',
})(NewUserForm);

