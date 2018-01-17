import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import PaddedContent from '../../../../../common/paddedContent';
import SpreadContent from '../../../../../common/spreadContent';
import { sendReminder } from '../../../../../../reducers/cfeiReviewers';

const messages = {
  assessments: 'Assessments',
  reminder: 'Send reminder',
};

const SingleReviewer = (props) => {
  const {
    reviewer: {
      user_id: userId,
      user_name: username,
      assessments: {
        counts,
        eoi_id: eoiId,
        send_reminder: doSendReminder,
      } = {},
    } = {},
    isFocalPoint,
    notifyReviewer } = props;
  return (
    <div>
      <PaddedContent>
        <SpreadContent>
          <Typography >{username}</Typography>
          <Typography type="caption">{`${counts} ${messages.assessments}`}</Typography>
        </SpreadContent>
      </PaddedContent >
      {isFocalPoint && doSendReminder && <Grid container justify="flex-end">
        <Grid item>
          <Button color="accent" onClick={notifyReviewer}>{messages.reminder}</Button>
        </Grid>
      </Grid>}
      <Divider />
    </div>
  );
};

SingleReviewer.propTypes = {
  reviewer: PropTypes.object,
  isFocalPoint: PropTypes.bool,
  notifyReviewer: PropTypes.func,
};

const mapDispatchToProps = (dispatch, {
  reviewer: {
    user_id: reviewerId,
    assessments: {
      eoi_id: eoiId,
    } = {},
  } = {},
}) => ({
  notifyReviewer: () => dispatch(sendReminder(eoiId, reviewerId)),
});


export default connect(null, mapDispatchToProps)(SingleReviewer);
