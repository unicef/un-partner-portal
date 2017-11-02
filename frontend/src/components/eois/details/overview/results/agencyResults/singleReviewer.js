import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import PaddedContent from '../../../../../common/paddedContent';
import SpreadContent from '../../../../../common/spreadContent';

const messages = {
  assessments: 'Assessments',
  reminder: 'Send reminder',
};

const SingleReviewer = (props) => {
  const {
    reviewer: {
      user_id,
      user_name,
      assessments: {
        counts,
        eoi_id,
        send_reminder,
      } = {},
    } = {},
    isFocalPoint } = props;
  return (
    <div>
      <PaddedContent>
        <SpreadContent>
          <Typography >{user_name}</Typography>
          <Typography type="caption">{`${counts} ${messages.assessments}`}</Typography>
        </SpreadContent>
      </PaddedContent >
      {isFocalPoint && send_reminder && <Grid container justify="flex-end">
        <Grid item>
          <Button color="accent">{messages.reminder}</Button>
        </Grid>
      </Grid>}
      <Divider />
    </div>
  );
};

SingleReviewer.propTypes = {
  reviewer: PropTypes.object,
  isFocalPoint: PropTypes.bool,
};

export default SingleReviewer;
