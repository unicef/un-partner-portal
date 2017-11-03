import React from 'react';
import GridColumn from '../../common/grid/gridColumn';
import GridRow from '../../common/grid/gridRow';
import LastProfileUpdate from './lastProfileUpdate';
import ListOfPendingOffers from './listOfPendingOffers';
import ListOfSubmittedCN from './listOfSubmittedConceptNotes';
import NumberOfAwards from './numberOfAwards';
import NumberOfCfeisBySector from './numberOfCfeisBySector';
import NumberOfPinnedCfei from './numberOfPinnedCfeis';
import NumberOfSubmittedCN from './numberOfSubmittedConceptNotes';

const PartnerDashboard = (props) => {
  const { } = props;

  return (
    <GridColumn>
      <GridRow columns={3}>
        <NumberOfCfeisBySector />
        <NumberOfSubmittedCN />
        <GridColumn>
          <NumberOfPinnedCfei number={30} />
          <NumberOfAwards number={3} />
          <LastProfileUpdate date={new Date()} />
        </GridColumn>
      </GridRow>
      <ListOfSubmittedCN />
      <ListOfPendingOffers />
    </GridColumn>);
};


export default PartnerDashboard;
