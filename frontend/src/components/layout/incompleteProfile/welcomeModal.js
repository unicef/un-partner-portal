import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { sessionChange } from '../../../reducers/session';
import ControlledModal from '../../common/modals/controlledModal';
import PaddedContent from '../../common/paddedContent';

const messages = {
  title: 'Welcome!',
  text: 'Your organization is successfully registered to the UN Partner Portal! ' +
  'You can view all Calls for Expression of Interests, but to submit a Concept Note, ' +
  'you need to complete you organization profile.',
  cfeiButton: 'View calls for expressions of interest',
  profileButton: 'Complete Profile',
};


class WelcomeModal extends Component {
  constructor(props) {
    super(props);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.navigateToCfei = this.navigateToCfei.bind(this);
    this.navigateToProfile = this.navigateToProfile.bind(this);
  }

  handleDialogClose() {
    this.props.processModal();
  }

  navigateToCfei() {
    history.push('/cfei/open');
    this.handleDialogClose();
  }

  navigateToProfile() {
    history.push('/profile');
    this.handleDialogClose();
  }

  render() {
    const { displayDialog } = this.props;

    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={displayDialog}
          handleDialogClose={this.handleDialogClose}
          buttons={{
            flat: {
              handleClick: this.navigateToCfei,
              label: messages.cfeiButton,
            },
            raised: {
              handleClick: this.navigateToProfile,
              label: messages.profileButton,
            },
          }}
          content={<PaddedContent><Typography >
            {messages.text}
          </Typography></PaddedContent>}
        />
      </div >
    );
  }
}

WelcomeModal.propTypes = {
  processModal: PropTypes.func,
  displayDialog: PropTypes.bool,
};

const mapStateToProps = state => ({
  displayDialog: state.session.newlyRegistered,
});


const mapDispatchToProps = dispatch => ({
  processModal: () => dispatch(sessionChange({ newlyRegistered: false })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WelcomeModal);
