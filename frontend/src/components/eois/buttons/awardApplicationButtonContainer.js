import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import AwardApplicationButton from './awardApplicationButton';
import { APPLICATION_STATUSES } from '../../../helpers/constants';


const concatText = (text, message) => `${text}${message} \n`;

const messages = {
  notVerified: 'Partner is not verified',
  notPreselected: 'Application is not preselected',
  redFlag: 'Partner has red flag',
  noReviews: 'All assessments are not done yet',
  awarded: 'Selected',
};

const renderTooltipText = ({
  status,
  isVerified,
  redFlags,
  completedReview,
}) => {
  let text = '';
  if (status !== APPLICATION_STATUSES.PRE) {
    text = concatText(text, messages.tooltip.notPreselected);
  }
  if (!isVerified) text = concatText(text, messages.tooltip.notVerified);
  if (redFlags) text = concatText(text, messages.tooltip.redFlag);
  if (!completedReview) text = concatText(text, messages.tooltip.noReviews);
  return text;
};


const AwardApplicationButtonContainer = (props) => {
  const { loading, status, isVerified, redFlags, completedReview, applicationId, CustomButton, didWin } = props;
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
        {didWin ? <Button color="accent" disabled>{messages.awarded}</Button> : CustomButton ? <CustomButton disabled={disableAward} /> : <AwardApplicationButton
          disabled={disableAward}
          applicationId={applicationId}
        />}
      </div>
    </Tooltip>
  );
};


AwardApplicationButtonContainer.propTypes = {
  applicationId: PropTypes.string,
  loading: PropTypes.bool,
  status: PropTypes.string,
  isVerified: PropTypes.bool,
  redFlags: PropTypes.number,
  completedReview: PropTypes.bool,
  CustomButton: PropTypes.element,
  didWin: PropTypes.bool,
};


export default AwardApplicationButtonContainer;
