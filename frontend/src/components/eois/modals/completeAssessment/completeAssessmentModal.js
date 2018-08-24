import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { completeAssessmentRequest } from '../../../../reducers/completeAssessment';
import { loadCfei } from '../../../../reducers/cfeiDetails';
import { selectApplicationPartnerName } from '../../../../store';

const messages = {
  complete: 'complete',
  title: 'Are you sure you want to complete your assessment?',
  header: 'Once your assessments are completed you will no longer be able to edit your scores.',
};

class AddReviewModal extends Component {
  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
  }
  onComplete() {
    const { completeAssessment, handleDialogClose, loadCfeiDetails } = this.props;

    completeAssessment()
      .then(() => { loadCfeiDetails(); handleDialogClose(); })
      .catch((error) => {
        const errorMsg = messages.error;
        throw new SubmissionError({
          ...error.response.data,
          _error: errorMsg,
        });
      });
  }

  render() {
    const { dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          info={{ title: messages.header }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.onComplete,
              label: messages.complete,
            },
          }}
          content={''}
        />
      </div >
    );
  }
}

AddReviewModal.propTypes = {
  dialogOpen: PropTypes.bool,
  loadCfeiDetails: PropTypes.func,
  completeAssessment: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps.params;
  const partnerName = selectApplicationPartnerName(state, applicationId);
  return {
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { id } } = ownProps;
  return {
    completeAssessment: () => dispatch(completeAssessmentRequest(id)),
    loadCfeiDetails: () => dispatch(loadCfei(id)),
  };
};

const containerAddReviewModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddReviewModal);

export default withRouter(containerAddReviewModal);
