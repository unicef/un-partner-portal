import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import EditDateCfeiForm from './editDateCfeiForm';

const messages = {
  title: {
    open: 'Edit Call for Expressions of Interest',
    direct: 'Edit Direct Selection/Retention',
  },
  header: {
    open: 'This is an open selection',
    direct: 'This is a direct selection/retention',
  },
  save: 'save',
};


class EditDateCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    return this.props.updateCfei(values).then(() => {
      this.props.handleDialogClose();
    });
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose, type } = this.props;

    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title[type]}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{
            title: messages.header[type],
          }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<EditDateCfeiForm id={id} onSubmit={this.onFormSubmit} type={type} />}
        />
      </div >
    );
  }
}

EditDateCfeiModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  updateCfei: PropTypes.func,
  handleDialogClose: PropTypes.func,
  type: PropTypes.string,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.openCfeiSubmitting,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('editCfei')),
});

const containerEditDateCfeiModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditDateCfeiModal);

export default containerEditDateCfeiModal;
