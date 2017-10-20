import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../../common/grid/gridColumn';
import Reviews from './reviews';
import TotalScore from './reviewTotalScore';

const ReviewContent = (props) => {
  const { applicationId, isUserFocalPoint, isUserReviewer, justReason } = props;
  return (
    <GridColumn>
      <Grid container direction="row">
        <Grid item xs={12} sm={8}>
          <Reviews
            applicationId={applicationId}
            isUserFocalPoint={isUserFocalPoint}
            isUserReviewer={isUserReviewer}
          />
        </Grid>
        {isUserFocalPoint && <Grid item xs={12} sm={4}>
          <TotalScore applicationId={applicationId} justReason={justReason} />
        </Grid>}
      </Grid>
      <Divider />
    </GridColumn>
  );
};

ReviewContent.propTypes = {
  applicationId: PropTypes.string,
  isUserFocalPoint: PropTypes.bool,
  isUserReviewer: PropTypes.bool,
  justReason: PropTypes.string,
};

export default ReviewContent;
