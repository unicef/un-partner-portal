import R from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../components/forms/textFieldForm';
import GridColumn from '../../../components/common/grid/gridColumn';
import { email } from '../../../helpers/validation';
import RoleField from './roleField';

const messages = {
  formName: 'newUserForm',
  selectPartners: 'Select Partners',
  selectionCriteria: 'Selection Criteria',
  firstName: 'Full name',
  email: 'E-mail',
};

const NewUserForm = (props) => {
  const { handleSubmit, id } = props;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ width: '40vw' }}>
        <GridColumn>
          <TextFieldForm
            label={messages.firstName}
            fieldName="fullname"
            readOnly={!R.isNil(id)}
          />
          <TextFieldForm
            label={messages.email}
            fieldName="email"
            validation={[email]}
            readOnly={!R.isNil(id)}
          />
          <RoleField formName="newUserForm" />
        </GridColumn>
      </div>
    </form >
  );
};

NewUserForm.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.string,
};

const formNewUser = reduxForm({
  form: 'newUserForm',
})(NewUserForm);

const mapStateToProps = (state, ownProps) => {
  let initialValues;

  if (ownProps.id) {
    const users = state.idPortalUsersList.users;
    const user = R.find(R.propEq('id', ownProps.id))(users);

    const fullname = user.fullname;
    const email = user.email;
    const office_memberships = R.map(item => R.assoc('office_id', item.office.id,
      R.assoc('role', item.role, null))
      , user.office_memberships);

    initialValues = { fullname, email, office_memberships };
  }

  return {
    initialValues,
  };
};

export default connect(
  mapStateToProps,
)(formNewUser);

