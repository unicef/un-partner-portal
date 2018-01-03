import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import { Link } from 'react-router';
import AwardApplicationButton from './awardApplicationButton';
import { APPLICATION_STATUSES } from '../../../helpers/constants';


const concatText = (text, message) => `${text}${message} \n`;

const messages = {
  notVerified: 'Partner is not verified',
  notPreselected: 'Application is not preselected',
  redFlag: 'Partner has red flag',
  noReviews: 'All assessments are not done yet',
  awarded: 'Selected',
  award: 'select',
  withdraw: 'selection retracted',
};

const renderTooltipText = ({
  status,
  isVerified,
  redFlags,
  completedReview,
}) => {
  let text = '';
  if (status !== APPLICATION_STATUSES.PRE) {
    text = concatText(text, messages.notPreselected);
  }
  if (!isVerified) text = concatText(text, messages.notVerified);
  if (redFlags) text = concatText(text, messages.redFlag);
  if (!completedReview) text = concatText(text, messages.noReviews);
  return text;
};


const AwardApplicationButtonContainer = (props) => {
  const { loading,
    status,
    isVerified,
    redFlags,
    completedReview,
    applicationId,
    linkedButton,
    didWin,
    didWithdraw,
    eoiId } = props;
  const disableAward = loading
  || status !== APPLICATION_STATUSES.PRE
  || !isVerified
  || redFlags
  || !completedReview;
  return (
    <Tooltip
      style={{ whiteSpace: 'pre-line' }}
      disableTriggerFocus={!disableAward}
      disableTriggerHover={!disableAward}
      disableTriggerTouch={!disableAward}
      id="tooltip-award-button"
      title={renderTooltipText({ status, isVerified, redFlags, completedReview })}
      placement="bottom"
    >
      <div>
        {didWin
          ? <Button color="accent" disabled>{didWithdraw ? messages.withdraw : messages.awarded}</Button>
          : linkedButton
            ? (<Button
              // className={classes.button}
              raised
              component={Link}
              to={{
                pathname: `/cfei/open/${eoiId}/applications/${applicationId}`,
                hash: '#award-open',
              }}
              color="accent"
              disabled={disableAward}
            >
              {messages.award}
            </Button>)
            : <AwardApplicationButton
              disabled={disableAward}
              applicationId={applicationId}
            />}
      </div>
    </Tooltip>
  );
};


AwardApplicationButtonContainer.propTypes = {
  applicationId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  loading: PropTypes.bool,
  status: PropTypes.string,
  isVerified: PropTypes.bool,
  redFlags: PropTypes.number,
  completedReview: PropTypes.bool,
  linkedButton: PropTypes.bool,
  didWin: PropTypes.bool,
  didWithdraw: PropTypes.bool,
  eoiId: PropTypes.string,
};


export default AwardApplicationButtonContainer;
