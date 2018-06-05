import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PaddedContent from '../../../../../common/paddedContent';
import SpreadContent from '../../../../../common/spreadContent';
import WithdrawApplicationButton from '../../../../buttons/withdrawApplicationButton';
import SimpleCollapsableItem from '../../../../../common/simpleCollapsableItem';
import ExpandedAssessmentAward from './expandedAssessmentsAward';
import { selectApplicationWithdrawalStatus, isCfeiCompleted } from '../../../../../../store';

const messages = {
  retracted: 'Retracted',
};
const styleSheet = theme => ({
  fullWidth: {
    width: '100%',
  },
  withdrawReason: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  reasonText: {
    paddingRight: theme.spacing.unit * 2,
  },
});

const SingleAward = (props) => {
  const { classes,
    award,
    isFocalPoint,
    withdrawReason,
    didWithdraw,
    cfeiCompleted } = props;
  return (<SimpleCollapsableItem
    title={
      <PaddedContent className={classes.fullWidth}>
        <SpreadContent>
          <Typography type="body2">
            {award.partner_name}
          </Typography>
          {isFocalPoint && didWithdraw ? <div className={classes.withdrawReason}>
            <Button disabled>{messages.retracted}</Button>
            <Typography
              className={classes.reasonText}
              type="caption"
            >{withdrawReason}</Typography>
          </div>
            : true
            />}
        </SpreadContent>
      </PaddedContent >}
    component={<ExpandedAssessmentAward awardInfo={award} />}
  />);
};

SingleAward.propTypes = {
  classes: PropTypes.object,
  award: PropTypes.object,
  isFocalPoint: PropTypes.bool,
  withdrawReason: PropTypes.string,
  didWithdraw: PropTypes.bool,
  cfeiCompleted: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const { withdraw_reason: withdrawReason,
    did_withdraw: didWithdraw,
  } = selectApplicationWithdrawalStatus(state, ownProps.award.application_id);
  return {
    cfeiCompleted: isCfeiCompleted(state, ownProps.eoiId),
    withdrawReason,
    didWithdraw,
  };
};


export default withStyles(styleSheet)(connect(mapStateToProps)(SingleAward));
