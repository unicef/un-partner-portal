import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateApplicationReview } from '../../../../reducers/applicationReviews';
import AddReviewForm from './addReviewForm';
import { selectApplicationPartnerName } from '../../../../store';

const messages = {
  header: 'You are reviewing application of',
  save: 'save',
};


class AddReviewModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateApplicationReview(values);
  }

  render() {
    const { id, scores, title, submit, dialogOpen, handleDialogClose, partnerName } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={title}
          trigger={dialogOpen}
          handleDialogClose={this.onDialogClose}
          info={{ title: `${messages.header}: ${partnerName}` }}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: submit,
              label: messages.save,
            },
          }}
          content={<AddReviewForm scores={scores} id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

AddReviewModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  updateApplicationReview: PropTypes.func,
  handleDialogClose: PropTypes.func,
  partnerName: PropTypes.string,
  title: PropTypes.string,
  scores: PropTypes.array,
};


const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps.params;
  const partnerName = selectApplicationPartnerName(state, applicationId);
  return {
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params: { applicationId }, reviewer, assessmentId } = ownProps;
  return {
    updateApplicationReview: body => dispatch(updateApplicationReview(
      applicationId, reviewer, assessmentId, body)),
    submit: () => dispatch(submit('addReview')),
  };
};

const containerAddReviewModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddReviewModal);

export default withRouter(containerAddReviewModal);
