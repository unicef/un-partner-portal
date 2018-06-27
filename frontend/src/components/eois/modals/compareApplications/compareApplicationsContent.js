import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import download from 'downloadjs';
import VerificationText from '../../../partners/profile/common/verificationText';
import FlaggingStatus from '../../../partners/profile/common/flaggingStatus';
import AwardApplicationButtonContainer from '../../buttons/awardApplicationButtonContainer';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';
import { checkPermission, AGENCY_PERMISSIONS, isRoleOffice, AGENCY_ROLES } from '../../../../helpers/permissions';
import { isUserAFocalPoint, isUserACreator, selectApplication } from '../../../../store';
import { selectCfeiDetail } from '../../../../reducers/cfeiDetails';

const messages = {
  labelAward: 'Choose successful applicant(s)',
  print: 'Download',
};


const styleSheet = theme => ({
  lightGrey: {
    minWidth: '50vw',
    background: theme.palette.common.lightGreyBackground,
  },
  gridContainer: {
    display: 'grid',
  },
  subGrid: {
    padding: theme.spacing.unit * 2,
    display: 'grid',
    alignItems: 'flex-start',
    gridGap: `0px ${theme.spacing.unit * 2}px !important`,
  },
  button: {
    width: '50%',
  },
  noPrint: {
    '@media print': {
      display: 'none',
      height: 0,
      width: 0,
    },
  },
  iframe: {
    height: 0,
    width: 0,
    position: 'absolute',
  },
  wrappedText: {
    wordBreak: 'break-word',
  },
  printButton: {
    margin: theme.spacing.unit * 2,
  },
});

class CompareApplicationContent extends React.Component {
  constructor(props) {
    super(props);

    this.isSelectActionAllowed = this.isSelectActionAllowed.bind(this);
    this.isSelectRecommendedActionAllowed = this.isSelectRecommendedActionAllowed.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.report !== this.props.report) {
      download(nextProps.report, 'UNPP_comparison_report.xlsx');
    }
  }

  isSelectRecommendedActionAllowed() {
    const {
      isAdvEd,
      isMFT,
      isFocalPoint,
      hasSelectRecommendedPermission } = this.props;

    return ((hasSelectRecommendedPermission && isAdvEd && isFocalPoint)
    || (hasSelectRecommendedPermission && isMFT && isFocalPoint));
  }

  isSelectActionAllowed() {
    const {
      isAdvEd,
      isCreator,
      hasSelectPermission } = this.props;

    return (hasSelectPermission && isAdvEd && isCreator);
  }

  render() {
    const { classes,
      columns,
      budgetOptions,
      comparison,
      applications,
      applicationsMeta,
      id,
      type,
      loading,
      onPrint } = this.props;
    const [names,
      ids,
      avgTotalScores,
      verification,
      flagging,
      establishment,
      unExp,
      budgets] = comparison;

    return (
      <div>
        <iframe title="printWindow" ref={(node) => { this.printWindow = node; }} className={classes.iframe} />
        <div ref={(node) => { this.comparisonContent = node; }} className={`${classes.gridContainer}`}>
          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 1,
            }}
            className={`${classes.subGrid} ${classes.lightGrey}`}
          >
            {names.map((name, index) => (
              <Typography
                style={{ msGridColumn: index + 1 }}
                key={ids[index]}
                type="body2"
              >
                {name}
              </Typography>
            ))}
          </div>
          <Divider />

          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 2,
            }}
            className={classes.subGrid}
          >
            {ids.map((appId, index) => {
              if (index === 0) {
                return (<Typography
                  style={{ msGridColumn: index + 1 }}
                  key={appId}
                >{appId}</Typography>);
              }
              return (<Typography
                style={{ msGridColumn: index + 1 }}
                key={appId}
                color="accent"
                component={Link}
                to={`/cfei/${type}/${id}/applications/${appId}`}
              >
                {appId}
              </Typography>);
            })}
          </div>
          <Divider />
          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 3,
            }}
            className={classes.subGrid}
          >
            {avgTotalScores.map((score, index) => (
              <Typography
                style={{ msGridColumn: index + 1 }}
                key={ids[index]}
              >
                {score}
              </Typography>
            ))}
          </div>
          <Divider />

          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 4,
            }}
            className={classes.subGrid}
          >
            {verification.map((singleVerification, index) => {
              if (index === 0) {
                return (<Typography
                  style={{ msGridColumn: index + 1 }}
                  key={ids[index]}
                >{singleVerification}</Typography>);
              }
              return (<div style={{ msGridColumn: index + 1 }}><VerificationText
                key={ids[index]}
                verified={singleVerification}
              /></div>);
            })}
          </div>
          <Divider />

          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 5,
            }}
            className={classes.subGrid}
          >
            {flagging.map((flag, index) => {
              if (index === 0) return (<Typography style={{ msGridColumn: index + 1 }} key={ids[index]}>{flag}</Typography>);
              return (<div style={{ msGridColumn: index + 1 }}><FlaggingStatus key={ids[index]} flags={flag} noFlagText /></div>);
            })}
          </div>
          <Divider />

          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 6,
            }}
            className={classes.subGrid}
          >
            {establishment.map((year, index) => (<Typography style={{ msGridColumn: index + 1 }} key={ids[index]}>
              {year}
            </Typography>))}
          </div>
          <Divider />


          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 7,
            }}
            className={classes.subGrid}
          >
            {unExp.map((exp, index) => (
              <Typography style={{ msGridColumn: index + 1 }} key={ids[index]}>
                {exp}
              </Typography>))}
          </div>
          <Divider />

          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 8,
            }}
            className={classes.subGrid}
          >
            {budgets.map((budget, index) => {
              if (index === 0) return (<Typography style={{ msGridColumn: index + 1 }} key={ids[index]}>{budget}</Typography>);
              return (<Typography style={{ msGridColumn: index + 1 }} className={classes.wrappedText} key={ids[index]}>
                {budgetOptions[budget]}
              </Typography>);
            })}
          </div>
          <Divider />
        </div>
        <div>
          <div
            style={{
              grid: `none / repeat(${columns}, 1fr)`,
              msGridColumns: '1fr '.repeat(columns),
              msGridRow: 9,
            }}
            className={classes.subGrid}
          >
            <Typography type="body2">{messages.labelAward}</Typography>
            {applications.map((application, index) => (
              <div style={{ msGridColumn: index + 2 }}>
                {(this.isSelectActionAllowed() || this.isSelectRecommendedActionAllowed)
                  && <AwardApplicationButtonContainer
                    key={ids[index]}
                    loading={loading}
                    status={APPLICATION_STATUSES.PRE}
                    isVerified={verification[index + 1]}
                    redFlags={flagging[index + 1].red}
                    completedReview={applicationsMeta[index].assessments_is_completed}
                    applicationId={application}
                    eoiId={id}
                    didWin={applicationsMeta[index].did_win}
                    didWithdraw={applicationsMeta[index].did_withdraw}
                    linkedButton
                  />}
              </div>))}
          </div>
          <Divider />
        </div>
        <Grid container justify="flex-end">
          <Grid item>
            <Button className={classes.printButton} onClick={onPrint} color="accent">{messages.print}</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

CompareApplicationContent.propTypes = {
  comparison: PropTypes.array,
  columns: PropTypes.number,
  id: PropTypes.string,
  type: PropTypes.string,
  classes: PropTypes.object,
  applications: PropTypes.array,
  budgetOptions: PropTypes.object,
  loading: PropTypes.bool,
  applicationsMeta: PropTypes.array,
  onPrint: PropTypes.func,
  report: PropTypes.string,
  isAdvEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isFocalPoint: PropTypes.bool,
  isCreator: PropTypes.bool,
  hasSelectRecommendedPermission: PropTypes.bool,
  hasSelectPermission: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const cfeiDetails = selectCfeiDetail(state, ownProps.id) || {};

  return {
    isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
    isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
    isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
    isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
    isCreator: isUserACreator(state, cfeiDetails),
    isFocalPoint: isUserAFocalPoint(state, cfeiDetails),
    budgetOptions: state.partnerProfileConfig['budget-choices'],
    hasSelectPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_SELECT_PARTNER, state),
    hasSelectRecommendedPermission:
    checkPermission(AGENCY_PERMISSIONS.CFEI_SELECT_RECOMMENDED_PARTNER, state),
  };
};

export default connect(
  mapStateToProps,
)(withStyles(styleSheet, { withTheme: true })(CompareApplicationContent));
