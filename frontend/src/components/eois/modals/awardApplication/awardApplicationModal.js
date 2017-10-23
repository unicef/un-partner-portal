import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateApplication } from '../../../../reducers/applicationDetails';
import AwardApplicationForm from './awardApplicationForm';

const messages = {
  title: 'Award Concept Note',
  header: 'Partner will be notified by e-mail. Provide justification for your decision',
  award: 'award',
};


class awardApplicationModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateApplication({ ...values, did_win: true });
  }

  render() {
    const { submit, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          info={{ title: messages.header }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.award,
            },
          }}
          content={<AwardApplicationForm onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

awardApplicationModal.propTypes = {
  dialogOpen: PropTypes.bool,
  submit: PropTypes.func,
  handleDialogClose: PropTypes.func,
  updateApplication: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { applicationId } } = ownProps;
  return {
    updateApplication: body => dispatch(updateApplication(
      applicationId, body)),
    submit: () => dispatch(submit('awardApplication')),
  };
};

const containerAwardApplicationModal = connect(
  null,
  mapDispatchToProps,
)(awardApplicationModal);

export default withRouter(containerAwardApplicationModal);
