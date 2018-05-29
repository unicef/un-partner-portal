import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import CompleteCfeiForm from './completeCfeiForm';

const messages = {
  title: 'Are you sure you want to finalize this direct selection/retention?',
  header: { title: 'E-mail will be sent to participating partner.' },
  save: 'finalize',
};


class CompleteCfeiModal extends Component {
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
    const { id, submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          fullWidth
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={messages.header}
          minWidth={30}
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
