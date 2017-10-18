import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import CompleteCfeiForm from './completeCfeiForm';

const messages = {
  title: 'Edit Expression of Interests',
  header: {
    open: { title: 'This is an open selection' },
  },
  save: 'save',
};


class CompleteCfeiModal extends Component {
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
