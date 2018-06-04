import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { sendCfeiRequest } from '../../../../reducers/sendCfei';

const messages = {
  title: 'Are you sure you want to send this direct selection/retention to the focal point?',
  info: 'An e-mail notification that this CFEI is now finalized will be sent to all partners who applied for this CFEI.',
  send: 'send',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class SendDsrModal extends Component {
  constructor(props) {
    super(props);
    this.send = this.send.bind(this);
  }

  send() {
    return this.props.sendDsr().then(() => {
      this.props.handleDialogClose();
    });
  }

  render() {
    const { classes, dialogOpen, handleDialogClose } = this.props;
    return (
      <div>
        <ControlledModal
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          minWidth={40}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.send,
              label: messages.send,
            },
          }}
          content={
            <PaddedContent>
              <Typography className={classes.text} >{messages.info}</Typography>
            </PaddedContent>
          }
        />
      </div >
    );
  }
}

SendDsrModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  sendDsr: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.sendCfei.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  sendDsr: () => dispatch(sendCfeiRequest(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(SendDsrModal);

export default withStyles(styleSheet, { name: 'SendDsrModal' })(connected);
