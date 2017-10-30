import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ControlledModal from '../../../common/modals/controlledModal';
import CompareApplicationsContentContainer from './compareApplicationsContentContainer';

const messages = {
  title: 'Compare selected Concept Notes',

};


class CompareApplicationsModal extends Component {
  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(values) {
    this.props.handleDialogClose();
    this.props.updateApplicationReview(values);
  }

  render() {
    const { partners, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          removeContentPadding
          buttons={{ }}
          content={<CompareApplicationsContentContainer partners={partners} />}
        />
      </div >
    );
  }
}

CompareApplicationsModal.propTypes = {
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  partners: PropTypes.array,
};


export default withRouter(CompareApplicationsModal);
