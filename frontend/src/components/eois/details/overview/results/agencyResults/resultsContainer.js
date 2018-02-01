import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import GridColumn from '../../../../../common/grid/gridColumn';
import AwardedPartners from './awardedPartners';
import ReviewSummary from './reviewSummary';
import ReviewersSummary from './reviewersSummary';
import FinalizeJustification from './finalizeJustification';

const ResultsContainer = (props) => {
  const { id } = props;
  return (
    <Grid container direction="row" spacing={24}>
      <Grid item xs={12} sm={8}>
        <GridColumn >
          <ReviewSummary id={id} />
          <AwardedPartners id={id} />
        </GridColumn>
      </Grid>
      <Grid item xs={12} sm={4} >
        <GridColumn >
          <ReviewersSummary id={id} />
          <FinalizeJustification id={id} />
        </GridColumn>
      </Grid>
    </Grid>
  );
};

ResultsContainer.propTypes = {
  id: PropTypes.string,
};

export default ResultsContainer;
