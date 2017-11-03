import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ControlledModal from '../../../common/modals/controlledModal';
import CompareApplicationsContentContainer from './compareApplicationsContentContainer';

const messages = {
  title: 'Compare selected Concept Notes',

};


class CompareApplicationsModal extends Component {

  render() {
    const { applications, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          removeContentPadding
          buttons={{ }}
          content={<CompareApplicationsContentContainer applications={applications} />}
        />
      </div >
    );
  }
}

CompareApplicationsModal.propTypes = {
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  applications: PropTypes.array,
};


export default CompareApplicationsModal;
;
