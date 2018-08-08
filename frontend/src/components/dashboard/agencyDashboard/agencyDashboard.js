import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import GridColumn from '../../common/grid/gridColumn';
import NumberOfNewCfeis from './numberOfNewCfeis';
import NumberOfConceptNotes from './numberOfConceptNotes';
import ListOfConceptNotesContainer from './listOfConceptNotesContainer';
import ListOfOpenCfeiContainer from './listOfOpenCfeiContainer';
import NewPartners from './newPartners';
import NumberOfPartners from './numberOfPartners';
import PartnerDecisions from './partnerDecisions';
import Loader from '../../common/loader';
import { checkPermission, AGENCY_PERMISSIONS } from '../../../helpers/permissions';

const styleSheet = (theme) => {
  const customPadding = theme.spacing.unit * 1.5;
  return {
    topGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gridTemplateRows: '1fr auto',
      '-ms-grid-columns': '1fr 1fr 1fr',
      '-ms-grid-rows': '1fr auto',
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    // custom padding here and below because grid gap not supported in IE 11
    newPartners: {
      gridColumnEnd: 'span 2',
      '-ms-grid-column': 1,
      '-ms-grid-row': 1,
      '-ms-grid-column-span': 2,
      paddingBottom: customPadding,
      paddingRight: customPadding,
    },
    numberOfPartners: {
      gridRowEnd: 'span 2',
      '-ms-grid-column': 3,
      '-ms-grid-row': 1,
      '-ms-grid-row-span': 2,
      paddingLeft: customPadding,
    },
    numberOfNewCfeis: {
      '-ms-grid-column': 1,
      '-ms-grid-row': 2,
      paddingTop: customPadding,
      paddingRight: customPadding,
    },
    numberOfCNToScore: {
      '-ms-grid-column': 2,
      '-ms-grid-row': 2,
      paddingTop: customPadding,
      paddingLeft: customPadding,
      paddingRight: customPadding,
    },
  };
};

const AgencyDashboard = (props) => {
  const { loading,
    classes,
    hasReviewPermission,
    dashboard: {
      new_partners_last_15_count: newPartnersCount,
      new_partners_last_15_by_day_count: newPartnersByDayCount,
      new_cfei_last_15_by_day_count: newCfeiCount,
      num_cn_to_score: numCNToScore,
      partner_breakdown: partnerBreakdown,
    } } = props;
  return (
    <GridColumn>
      <div className={classes.topGrid}>
        <div className={classes.newPartners}>
          <Loader loading={loading} >
            <NewPartners number={newPartnersCount} dayBreakdown={newPartnersByDayCount} />
          </Loader>
        </div>
        <div className={classes.numberOfPartners}>
          <Loader loading={loading} >
            <NumberOfPartners partnerBreakdown={partnerBreakdown} />
          </Loader>
        </div>
        <div className={classes.numberOfNewCfeis}>
          <Loader loading={loading} >
            <NumberOfNewCfeis number={newCfeiCount} />
          </Loader>
        </div>
        <div className={classes.numberOfCNToScore}>
          <Loader loading={loading} >
            <NumberOfConceptNotes number={numCNToScore} />
          </Loader>
        </div>


      </div>
      {hasReviewPermission && <ListOfConceptNotesContainer />}
      <ListOfOpenCfeiContainer />
      <PartnerDecisions />
    </GridColumn>);
};

AgencyDashboard.propTypes = {
  classes: PropTypes.object,
  loading: PropTypes.bool,
  dashboard: PropTypes.object,
  hasReviewPermission: PropTypes.bool,
};

const mapStateToProps = state => ({
  hasReviewPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_REVIEW_APPLICATIONS, state),
});

const connected = connect(mapStateToProps)(AgencyDashboard);

export default withStyles(styleSheet, { name: 'agencyDashboard' })(connected);
