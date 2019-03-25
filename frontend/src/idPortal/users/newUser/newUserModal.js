import R from 'ramda';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { submit, SubmissionError } from 'redux-form';
import { loadUsersList } from '../../reducers/usersList';
import { addNewUser } from '../../reducers/newUser';
import { editUser } from '../../reducers/editUser';
import NewUserForm from './newUserForm';
import ControlledModal from '../../../components/common/modals/controlledModal';
import { errorToBeAdded } from '../../../reducers/errorReducer';
import Loader from '../../../components/common/loader';

const messages = {
  title: 'Add new user',
  status: 'Status: ',
  header: 'Email with invitation will be sent to provided email.',
  error: 'Unable to create new user',
};

class NewUserModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDialogSubmit = this.handleDialogSubmit.bind(this);
  }

  handleDialogSubmit() {
    this.props.submit();
  }

  handleSubmit(values) {
    if (R.isNil(this.props.id)) {
      return this.props.postUser(values).then((user) => {
        this.props.handleDialogClose();
        this.props.loadUsers();
      }).catch((error) => {
        this.props.postError(error, messages.error);
        throw new SubmissionError({
          ...error.response.data,
          _error: messages.error,
        });
      });
    }
    return this.props.patchUser(this.props.id, values).then((user) => {
      this.props.handleDialogClose();
      this.props.loadUsers();
    }).catch((error) => {
      this.props.postError(error, messages.error);
      throw new SubmissionError({
        ...error.response.data,
        _error: messages.error,
      });
    });
  }

  render() {
    const { handleDialogClose, id, open, userStatus, showLoading } = this.props;

    return (
      <React.Fragment>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={open}
          info={{ title: userStatus ? `${messages.status} ${userStatus}` : messages.header }}
          handleDialogClose={handleDialogClose}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.handleDialogSubmit,
            },
          }}
          content={<NewUserForm id={id} onSubmit={this.handleSubmit} />}
        />
        <Loader loading={showLoading} fullscreen />
      </React.Fragment>
    );
  }
}

NewUserModal.propTypes = {
  id: PropTypes.number,
  userStatus: PropTypes.string,
  open: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  submit: PropTypes.func,
  showLoading: PropTypes.bool,
  postUser: PropTypes.func,
  patchUser: PropTypes.func,
  loadUsers: PropTypes.func,
  postError: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  let user;

  if (ownProps.id) {
    const users = state.idPortalUsersList.users;
    user = R.find(R.propEq('id', ownProps.id))(users);
  }

  return {
    showLoading: state.idPortalNewUser.status.loading,
    userStatus: user && user.status,
  };
};

const mapDispatchToProps = dispatch => ({
  postUser: body => dispatch(addNewUser(body)),
  patchUser: (id, body) => dispatch(editUser(id, body)),
  submit: () => dispatch(submit('newUserForm')),
  loadUsers: params => dispatch(loadUsersList(params)),
  postError: (error, message) => dispatch(errorToBeAdded(error, 'newUser', message)),
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewUserModal);

export default withRouter(connected);

