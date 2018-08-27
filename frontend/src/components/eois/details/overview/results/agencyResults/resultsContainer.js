import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import GridColumn from '../../../../../common/grid/gridColumn';
import ReviewSummary from './reviewSummary';
import ReviewersSummary from './reviewersSummary';
import FinalizeJustification from './finalizeJustification';
import RecommendedPartners from './recommendedPartners/recommendedPartners';
import PreselectedPartners from './preselectedPartners/preselectedPartners';

const ResultsContainer = (props) => {
  const { id } = props;
  return (
    <Grid container direction="row" spacing={24}>
      <Grid item xs={12} sm={8}>
        <GridColumn >
          <RecommendedPartners id={id} />
          <PreselectedPartners id={id} />
        </GridColumn>
      </Grid>
      <Grid item xs={12} sm={4} >
        <GridColumn >
          <ReviewSummary id={id} />
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
