import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import EditCfeiForm from './editCfeiForm';

const messages = {
  title: 'Edit Expression of Interests',
  header: {
    open: { title: 'This is an open selection' },
  },
  save: 'save',
};


class EditCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateCfei(values);
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose, type } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          info={messages.header[type]}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<EditCfeiForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

EditCfeiModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  updateCfei: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.openCfeiSubmitting,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('editCfei')),
});

const containerEditCfeiModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditCfeiModal);

export default containerEditCfeiModal;
