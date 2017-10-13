import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import { updateCfei } from '../../../../reducers/newCfei';
import AddReviewForm from './addReviewForm';
import { selectApplicationPartnerName } from '../../../../store';

const messages = {
  title: 'Add review of the application',
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
    this.props.updateCfei(values);
  }

  render() {
    const { id, submit, dialogOpen, handleDialogClose, partnerName } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
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
          content={<AddReviewForm id={id} onSubmit={this.onFormSubmit} />}
        />
      </div >
    );
  }
}

AddReviewModal.propTypes = {
  dialogOpen: PropTypes.bool,
  id: PropTypes.string,
  submit: PropTypes.func,
  updateCfei: PropTypes.func,
  handleDialogClose: PropTypes.func,
  partnerName: PropTypes.string,
};


const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps.params;
  const partnerName = selectApplicationPartnerName(state, applicationId);
  return {
    partnerName,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateCfei: body => dispatch(updateCfei(body, ownProps.id)),
  submit: () => dispatch(submit('addReview')),
});

const containerAddReviewModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddReviewModal);

export default withRouter(containerAddReviewModal);
