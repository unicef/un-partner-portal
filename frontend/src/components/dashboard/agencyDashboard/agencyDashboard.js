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

const AgencyDashboard = (props) => {
  const { } = props;

  return (
    <GridColumn>
      <Grid container direction="row">
        <Grid item xs={12} sm={8}>
          <GridColumn>
            <NewPartners number={145} />
            <GridRow>
              <NumberOfNewCfeis number={2} />
              <NumberOfConceptNotes number={31} />
            </GridRow>
          </GridColumn>
        </Grid>
        <Grid item xs={12} sm={4}>
          <NumberOfPartners />
        </Grid>
      </Grid>
      <ListOfConceptNotesContainer />
      <ListOfOpenCfeisContainer />
      <PartnerDecisions />
    </GridColumn>);
};


export default AgencyDashboard;
