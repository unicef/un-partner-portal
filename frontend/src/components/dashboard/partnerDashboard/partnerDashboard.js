import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
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
import WelcomeModal from '../../layout/incompleteProfile/welcomeModal';

const styleSheet = () => ({
  grid: {
    height: 'calc(100% + 24px)',
  },
  largerBox: {
    height: '35%',
  },
  smallerBox: {
    height: '30%',
  },
});

const PartnerDashboard = (props) => {
  const { loading,
    classes,
    dashboard: {
      new_cfei_by_sectors_last_days_ago: newCfeiBySectors,
      num_of_submitted_cn: { count: numSubmittedCN, details: numSubmittedCNByAgency } = {},
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
          <NumberOfSubmittedCN
            numSubmittedCN={numSubmittedCN}
            numSubmittedCNByAgency={numSubmittedCNByAgency}
          />
        </Loader>
        <Grid container direction="column" spacing={24} className={classes.grid}>
          <Grid item className={classes.largerBox}>
            <Loader loading={loading} >
              <NumberOfPinnedCfei number={numPinnedCfei} />
            </Loader>
          </Grid>
          <Grid item className={classes.largerBox}>
            <Loader loading={loading} >
              <NumberOfAwards number={numAwards} />
            </Loader>
          </Grid>
          <Grid item className={classes.smallerBox}>
            <Loader loading={loading} >
              <LastProfileUpdate date={lastUpdate} />
            </Loader>
          </Grid>
        </Grid>
      </GridRow>
      <ListOfSubmittedCN />
      <ListOfPendingOffers />
      <WelcomeModal />
    </GridColumn>);
};

PartnerDashboard.propTypes = {
  loading: PropTypes.bool,
  dashboard: PropTypes.object,
  classes: PropTypes.object,
};


export default withStyles(styleSheet,
  { name: 'PartnerDashboard' })(PartnerDashboard);
