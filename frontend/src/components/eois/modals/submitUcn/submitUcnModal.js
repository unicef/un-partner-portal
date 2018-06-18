import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { submitUcnRequest } from '../../../../reducers/submitUcn';

const messages = {
  title: 'Are you sure you want to submit this UCN?',
  info: 'Please confirm that you want to submit this UCN. Email with notification will be sent to selected agency.',
  submit: 'submit',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class SubmitUcnModal extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit() {
    return this.props.submitUCN().then(() => {
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
              handleClick: this.submit,
              label: messages.submit,
            },
          }}
          content={
            <PaddedContent>
              <Typography className={classes.text}>{messages.info}</Typography>
            </PaddedContent>
          }
        />
      </div >
    );
  }
}

SubmitUcnModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  submitUCN: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = state => ({
  showLoading: state.submitUcn.status.loading,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  submitUCN: () => dispatch(submitUcnRequest(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(SubmitUcnModal);

export default withStyles(styleSheet, { name: 'SubmitUcnModal' })(connected);
