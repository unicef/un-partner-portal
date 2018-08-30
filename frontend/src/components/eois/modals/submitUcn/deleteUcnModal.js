import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { deleteUcnRequest } from '../../../../reducers/deleteUcn';

const messages = {
  title: 'Are you sure you want to delete this UCN?',
  info: 'Please confirm that you want to delete this Unsolicited Concept Note?',
  delete: 'delete',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class DeleteUcnModal extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
  }

  delete() {
    return this.props.deleteUcn().then(() => {
      history.push(this.props.previousPath);
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
          minwidth={40}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.delete,
              label: messages.delete,
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

DeleteUcnModal.propTypes = {
  classes: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool,
  deleteUcn: PropTypes.func,
  previousPath: PropTypes.string,
  handleDialogClose: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  showLoading: state.deleteUcn.status.loading,
  previousPath: state.routesHistory.previousPath || ownProps.defaultPath,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteUcn: () => dispatch(deleteUcnRequest(ownProps.id)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(DeleteUcnModal);

export default withStyles(styleSheet, { name: 'DeleteUcnModal' })(connected);
