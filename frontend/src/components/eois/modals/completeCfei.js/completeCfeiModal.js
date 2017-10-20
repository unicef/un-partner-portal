import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import CompleteCfeiForm from './completeCfeiForm';

const messages = {
  title: 'Are you sure you want to complete this CFEI?',
  header: { title: 'Email will be sent to all participating Partners.' },
  save: 'complete',
};


class CompleteCfeiModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateCfei({ ...values, status: 'Com' });
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          fullWidth
          title={messages.title}
          trigger={dialogOpen}
          info={messages.header}
          minWidth={40}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<CompleteCfeiForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

CompleteCfeiModal.propTypes = {
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
  submit: () => dispatch(submit('completeCfei')),
});

const containerCompleteCfeiModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompleteCfeiModal);

export default containerCompleteCfeiModal;
