import React from 'react';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GridColumn from '../../common/grid/gridColumn';
import GridRow from '../../common/grid/gridRow';
import NumberOfNewCfeis from './numberOfNewCfeis';
import NumberOfConceptNotes from './numberOfConceptNotes';
import ListOfConceptNotesContainer from './listOfConceptNotesContainer';
import ListOfOpenCfeisContainer from './listOfOpenCfeisContainer';
import NewPartners from './newPartners';
import NumberOfPartners from './numberOfPartners';
import PartnerDecisions from './partnerDecisions';
import Loader from '../../common/loader';

const AgencyDashboard = (props) => {
  const { loading,
    dashboard: {
      new_partners_last_15_count: newPartnersCount,
      new_partners_last_15_by_day_count: newPartnersByDayCount,
      new_cfei_last_15_by_day_count: newCfeiCount,
      num_cn_to_score: numCNToScore,
      partner_breakdown: partnerBreakdown,
    } } = props;
  return (
    <GridColumn>
      <Grid container direction="row">
        <Grid item xs={12} sm={8}>
          <GridColumn>
            <Loader loading={loading} >
              <NewPartners number={newPartnersCount} dayBreakdown={newPartnersByDayCount} />
            </Loader>
            <GridRow>
              <Loader loading={loading} >
                <NumberOfNewCfeis number={newCfeiCount} />
              </Loader>
              <Loader loading={loading} >
                <NumberOfConceptNotes number={numCNToScore} />
              </Loader>
            </GridRow>
          </GridColumn>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Loader loading={loading} >
            <NumberOfPartners partnerBreakdown={partnerBreakdown} />
          </Loader>
        </Grid>
      </Grid>
      <ListOfConceptNotesContainer />
      <ListOfOpenCfeisContainer />
      <PartnerDecisions />
    </GridColumn>);
};

AgencyDashboard.propTypes = {
  loading: PropTypes.bool,
  dashboard: PropTypes.object,
};


export default AgencyDashboard;
