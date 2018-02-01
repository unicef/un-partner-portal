
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

const styleSheet = theme => {
  const customPadding = theme.spacing.unit * 1.5;
  return {
    topGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: 'auto auto auto',
      '-ms-grid-columns': '1fr 1fr 1fr',
      '-ms-grid-rows': 'auto auto auto',
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
      }
    },
    // custom padding here and below because grid gap not supported in IE 11
    NumberOfCfeisBySector: {
      gridRowEnd: 'span 3',
      '-ms-grid-column': 1,
      '-ms-grid-row': 1,
      '-ms-grid-row-span': 3,
      paddingRight: customPadding,
    },
    numberOfSubmittedCN: {
      gridRowEnd: 'span 3',
      '-ms-grid-column': 2,
      '-ms-grid-row': 1,
      '-ms-grid-row-span': 3,
      paddingLeft: customPadding,
      paddingRight: customPadding,
    },
    numberOfPinnedCfei: {
      '-ms-grid-column': 3,
      '-ms-grid-row': 1,
      paddingBottom: customPadding,
      paddingLeft: customPadding,
    },
    numberOfAwards: {
      '-ms-grid-column': 3,
      '-ms-grid-row': 2,
      paddingTop: customPadding,
      paddingBottom: customPadding,
      paddingLeft: customPadding,
    },
    lastProfileUpdate: {
      '-ms-grid-column': 3,
      '-ms-grid-row': 3,
      paddingTop: customPadding,
      paddingLeft: customPadding,
    },
    gridItem: {
      [theme.breakpoints.down('sm')]: {
        padding: '12px 0'
      }
    },
  };
};

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
      <div className={classes.topGrid}>
        <div className={`${classes.NumberOfCfeisBySector} ${classes.gridItem}`}>
          <Loader loading={loading} >
            <NumberOfCfeisBySector newCfeiBySectors={newCfeiBySectors} />
          </Loader>
        </div>
        <div className={`${classes.numberOfSubmittedCN} ${classes.gridItem}`}>
          <Loader loading={loading} >
            <NumberOfSubmittedCN
              numSubmittedCN={numSubmittedCN}
              numSubmittedCNByAgency={numSubmittedCNByAgency}
            />
          </Loader>
        </div>
        <div className={`${classes.numberOfPinnedCfei} ${classes.gridItem}`}>
          <Loader loading={loading} >
            <NumberOfPinnedCfei number={numPinnedCfei} />
          </Loader>
        </div>
        <div className={`${classes.numberOfAwards} ${classes.gridItem}`}>
          <Loader loading={loading} >
            <NumberOfAwards number={numAwards} />
          </Loader>
        </div>
        <div className={`${classes.lastProfileUpdate} ${classes.gridItem}`}>
          <Loader loading={loading} >
            <LastProfileUpdate date={lastUpdate} />
          </Loader>
        </div>
      </div>
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
