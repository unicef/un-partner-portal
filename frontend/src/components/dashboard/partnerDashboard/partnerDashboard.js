import React from 'react';
import PropTypes from 'prop-types';
import GridColumn from '../../common/grid/gridColumn';
import GridRow from '../../common/grid/gridRow';
import LastProfileUpdate from './lastProfileUpdate';
import ListOfPendingOffers from './listOfPendingOffers';
import ListOfSubmittedCN from './listOfSubmittedConceptNotes';
import NumberOfAwards from './numberOfAwards';
import NumberOfCfeisBySector from './numberOfCfeisBySector';
import NumberOfPinnedCfei from './numberOfPinnedCfeis';
import NumberOfSubmittedCN from './numberOfSubmittedConceptNotes';
import Loader from '../../common/loader';

const PartnerDashboard = (props) => {
  const { loading,
    dashboard: {
      new_cfei_by_sectors_last_days_ago: newCfeiBySectors,
      number_of_submitted_cn: numSubmittedCN,
      num_of_pinned_cfei: numPinnedCfei,
      num_of_awards: numAwards,
      last_profile_update: lastUpdate,
    } } = props;

  return (
    <GridColumn>
      <GridRow columns={3}>
        <Loader loading={loading} >
          <NumberOfCfeisBySector newCfeiBySectors={newCfeiBySectors} />
        </Loader>
        <Loader loading={loading} >
          <NumberOfSubmittedCN />
        </Loader>
        <GridColumn>
          <Loader loading={loading} >
            <NumberOfPinnedCfei number={numPinnedCfei} />
          </Loader>
          <Loader loading={loading} >
            <NumberOfAwards number={numAwards} />
          </Loader>
          <Loader loading={loading} >
            <LastProfileUpdate date={lastUpdate} />
          </Loader>
        </GridColumn>
      </GridRow>
      <ListOfSubmittedCN />
      <ListOfPendingOffers />
    </GridColumn>);
};

PartnerDashboard.propTypes = {
  loading: PropTypes.bool,
  dashboard: PropTypes.object,
};


export default PartnerDashboard;
