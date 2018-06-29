import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Loader from '../../../common/loader';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import EditCfeiForm from './editCfeiForm';

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


class EditCfeiModal extends Component {
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
    const { id, submit, dialogOpen, handleDialogClose, showLoading, type } = this.props;

    return (
      <React.Fragment>
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
          content={<EditCfeiForm id={id} onSubmit={this.onFormSubmit} type={type} />}
        />
        <Loader loading={showLoading} fullscreen />
      </React.Fragment>
    );
  }
}

EditCfeiModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  updateCfei: PropTypes.func,
  handleDialogClose: PropTypes.func,
  type: PropTypes.string,
  showLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  showLoading: state.newCfei.editCfeiSubmitting,
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
