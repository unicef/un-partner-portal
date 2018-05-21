import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { submit, SubmissionError } from 'redux-form';
import { loadUsersList } from '../../reducers/usersList';
import { addNewUser } from '../../reducers/newUser';
import NewUserForm from './newUserForm';
import ControlledModal from '../../../components/common/modals/controlledModal';
import { errorToBeAdded } from '../../../reducers/errorReducer';
import Loader from '../../../components/common/loader';

const messages = {
  title: 'Add new user',
  header: 'Email with invitation will be send at provided e-mail.',
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
    return this.props.postUser(values).then((user) => {
      this.props.onDialogClose();
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
    const { onDialogClose, open, showLoading } = this.props;
    
    return (
      <React.Fragment>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={open}
          info={{ title: messages.header }}
          handleDialogClose={onDialogClose}
          buttons={{
            flat: {
              handleClick: onDialogClose,
            },
            raised: {
              handleClick: this.handleDialogSubmit,
            },
          }}
          content={<NewUserForm onSubmit={this.handleSubmit} />}
        />
        <Loader loading={showLoading} fullscreen />
      </React.Fragment>
    );
  }
}

NewUserModal.propTypes = {
  open: PropTypes.bool,
  onDialogClose: PropTypes.func,
  submit: PropTypes.func,
  showLoading: PropTypes.bool,
  postUser: PropTypes.func,
  loadUsers: PropTypes.func,
  postError: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.idPortalNewUser.status.loading,
});

const mapDispatchToProps = dispatch => ({
  postUser: body => dispatch(addNewUser(body)),
  submit: () => dispatch(submit('newUserForm')),
  loadUsers: params => dispatch(loadUsersList(params)),
  postError: (error, message) => dispatch(errorToBeAdded(error, 'newUser', message)),
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewUserModal);

export default withRouter(connected);

