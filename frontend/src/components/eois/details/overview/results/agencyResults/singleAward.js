import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PaddedContent from '../../../../../common/paddedContent';
import SpreadContent from '../../../../../common/spreadContent';
import WithdrawApplicationButton from '../../../../buttons/withdrawApplicationButton';
import SimpleCollapsableItem from '../../../../../common/simpleCollapsableItem';
import ExpandedAssessmentAward from './expandedAssessmentsAward';

const messages = {
  retracted: 'Retracted',
};
const styleSheet = () => ({
  fullWidth: {
    width: '100%',
  },
});

const SingleAward = (props) => {
  const { classes,
    award,
    isFocalPoint } = props;
  return (<SimpleCollapsableItem
    title={
      <PaddedContent className={classes.fullWidth}>
        <SpreadContent>
          <Typography type="body2">
            {award.partner_name}
          </Typography>
          {isFocalPoint && award.did_withdraw ? <Button disabled>{messages.retracted}</Button>
            : <WithdrawApplicationButton
              applicationId={award.application_id}
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
};

export default withStyles(styleSheet)(SingleAward);
