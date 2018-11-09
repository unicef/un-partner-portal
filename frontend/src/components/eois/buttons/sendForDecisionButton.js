import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import { selectCfeiReviewSummary, cfeiHasRecommendedPartner, isSendForDecision, isCfeiCompleted } from '../../../store';
import withDialogHandling from '../../common/hoc/withDialogHandling';
import SendCfeiForDecisionModal from '../modals/sendCfeiForDecision/sendCfeiForDecisionModal';
import ButtonWithTooltip from '../../common/buttonWithTooltipEnabled';

const messages = {
  text: 'Send for decision',
  addRecommendedPartner: 'Recommend partner before sending recommendation',
  addSummary: 'Review summary needs to be filled in before forwarding for partner selection.',
  send: 'Recommendation sent',
};

const SendForDecisionButton = (props) => {
  const { id, handleDialogClose, handleDialogOpen, dialogOpen, hasRecommendedPartner,
    summary, isSend, isCompleted } = props;
  const tooltip = !hasRecommendedPartner && messages.addRecommendedPartner
    || R.isEmpty(summary.review_summary_comment) && messages.addSummary;

  return (
    <div>
      {!isCompleted && ((!hasRecommendedPartner || R.isEmpty(summary.review_summary_comment)) ?
        <ButtonWithTooltip
          name="send"
          disabled
          text={messages.text}
          tooltipText={tooltip}
          onClick={handleDialogOpen}
        />
        : <Button
          id={id}
          raised
          color="accent"
          disabled={isSend}
          onTouchTap={handleDialogOpen}
        >
          {isSend ? messages.send : messages.text}
        </Button>)}
      <SendCfeiForDecisionModal
        id={id}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
      />
    </div>
  );
};

SendForDecisionButton.propTypes = {
  id: PropTypes.number,
  dialogOpen: PropTypes.bool,
  handleDialogClose: PropTypes.func,
  handleDialogOpen: PropTypes.func,
  hasRecommendedPartner: PropTypes.bool,
  summary: PropTypes.object,
  isSend: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  summary: selectCfeiReviewSummary(state, ownProps.id),
  hasRecommendedPartner: cfeiHasRecommendedPartner(state, ownProps.id),
  isSend: isSendForDecision(state, ownProps.id),
  isCompleted: isCfeiCompleted(state, ownProps.id),
});

const connected = connect(mapStateToProps)(SendForDecisionButton);

export default withDialogHandling(connected);
