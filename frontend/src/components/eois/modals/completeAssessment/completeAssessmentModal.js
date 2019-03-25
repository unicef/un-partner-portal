import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { completeAssessmentRequest } from '../../../../reducers/completeAssessment';
import { loadCfei } from '../../../../reducers/cfeiDetails';
import { selectApplicationPartnerName } from '../../../../store';
import Loader from '../../../../components/common/loader';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';
import { loadApplications } from '../../../../reducers/partnersApplicationsList';

const messages = {
  complete: 'complete',
  title: 'Are you sure you want to complete your assessment?',
  header: 'Once your assessments are completed you will no longer be able to edit your scores.',
  error: 'You need to review all applications before completing.',
};

class CompleteAssessmentModal extends Component {
  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
  }
  onComplete() {
    const { completeAssessment, handleDialogClose, loadCfeiDetails, loadApplication } = this.props;

    completeAssessment()
      .then(() => {
        loadCfeiDetails();
        loadApplication();
        handleDialogClose();
      });
  }

  render() {
    const { dialogOpen, handleDialogClose, loading } = this.props;
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
        <Loader loading={loading} fullscreen />
      </div >
    );
  }
}

CompleteAssessmentModal.propTypes = {
  dialogOpen: PropTypes.bool,
  loading: PropTypes.bool,
  loadCfeiDetails: PropTypes.func,
  completeAssessment: PropTypes.func,
  loadApplication: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps.params;
  const partnerName = selectApplicationPartnerName(state, applicationId);
  return {
    loading: state.completeAssessment.status.loading,
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { id } } = ownProps;

  return {
    completeAssessment: () => dispatch(completeAssessmentRequest(id)),
    loadCfeiDetails: () => dispatch(loadCfei(id)),
    loadApplication: () => dispatch(
      loadApplications(id, { ...ownProps.location.query,
        status: [APPLICATION_STATUSES.PRE, APPLICATION_STATUSES.REC].join(',') })),
  };
};

const containerCompleteAssessmentModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompleteAssessmentModal);

export default withRouter(containerCompleteAssessmentModal);
