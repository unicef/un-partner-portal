import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import PaddedContent from '../../../common/paddedContent';
import ControlledModal from '../../../common/modals/controlledModal';
import { loadClarificationAnswers } from '../../../../reducers/clarificationAnswers';
import { removeClarificationAnswer } from '../../../../reducers/deleteClarificationAnswer';

const messages = {
  title: 'Are you sure you want to delete this answer?',
  info: 'Please confirm that you want to delete this answer.',
};

const styleSheet = theme => ({
  text: {
    color: theme.palette.common.lightBlack,
  },
});

class DeleteClarificationAnswerModal extends Component {
  constructor(props) {
    super(props);
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    const { handleDialogClose, deleteAnswer, loadAnswers } = this.props;

    return deleteAnswer()
      .then(() => loadAnswers())
      .then(() => handleDialogClose());
  }

  render() {
    const { classes, dialogOpen, handleDialogClose } = this.props;

    return (
      <div>
        <ControlledModal
          maxWidth="md"
          title={messages.title}
          trigger={dialogOpen}
          handleDialogClose={handleDialogClose}
          buttons={{
            flat: {
              handleClick: handleDialogClose,
            },
            raised: {
              handleClick: this.onDelete,
              label: messages.save,
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

DeleteClarificationAnswerModal.propTypes = {
  classes: PropTypes.object,
  dialogOpen: PropTypes.bool,
  deleteAnswer: PropTypes.func,
  loadAnswers: PropTypes.func,
  handleDialogClose: PropTypes.func,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteAnswer: () => dispatch(removeClarificationAnswer(ownProps.id)),
  loadAnswers: () => dispatch(loadClarificationAnswers(ownProps.cfeiId,
    { page: 1, page_size: 5 })),
});

const connected = connect(
  null,
  mapDispatchToProps,
)(DeleteClarificationAnswerModal);

export default withStyles(styleSheet, { name: 'DeleteClarificationAnswerModal' })(connected);
