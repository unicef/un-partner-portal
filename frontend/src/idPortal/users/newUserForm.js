
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import GridRow from '../../components/common/grid/gridRow';
import TextFieldForm from '../../components/forms/textFieldForm';
import GridColumn from '../../components/common/grid/gridColumn'; 
import { email } from '../../helpers/validation';

const messages = {
  selectPartners: 'Select Partners',
  selectionCriteria: 'Selection Criteria',
  firstName: 'First name',
  lastName: 'Last name',
  email: 'E-mail',
};


const NewUserFrom = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <GridRow columns={2} >
          <TextFieldForm
            label={messages.firstName}
            fieldName="firstName"
          />
          <TextFieldForm
            label={messages.firstName}
            fieldName="lastName"
          />
        </GridRow>
        <TextFieldForm
          label={messages.email}
          fieldName="email"
          validation={[email]}
        />
      </GridColumn>
    </form >
  );
};

NewUserFrom.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,

};

const connectedNewUserForm = connect(
  null,
)(NewUserFrom);

export default reduxForm({
  form: 'newUserForm',
})(connectedNewUserForm);

