import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import GridColumn from '../../../../../common/grid/gridColumn';
import AwardedPartners from './awardedPartners';
import ReviewSummary from './reviewSummary';
import ReviewersSummary from './reviewersSummary';
import DisabledForAgencyEditor from '../../../../../common/hoc/disabledForAgencyEditor';

const ResultsContainer = (props) => {
  const { id } = props;
  return (
    <Grid container direction="row" spacing={24}>
      <Grid item xs={12} sm={8}>
        <GridColumn >
          <DisabledForAgencyEditor>
            <ReviewSummary id={id} />
          </DisabledForAgencyEditor>
          <AwardedPartners id={id} />
        </GridColumn>
      </Grid>
      <Grid item xs={12} sm={4} >
        <DisabledForAgencyEditor>
          <ReviewersSummary id={id} />
        </DisabledForAgencyEditor>
      </Grid>
    </Grid>
  );
};

ResultsContainer.propTypes = {
  id: PropTypes.number,
};

export default ResultsContainer;
