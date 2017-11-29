import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import VerificationText from '../../../partners/profile/common/verificationText';
import FlaggingStatus from '../../../partners/profile/common/flaggingStatus';
import AwardApplicationButtonContainer from '../../buttons/awardApplicationButtonContainer';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';

const messages = {
  labelAward: 'Choose successful applicant(s)',
  award: 'Award',
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
    alignItems: 'center',
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
  },
});

const CompareApplicationContent = (props) => {
  const { classes,
    columns,
    budgetOptions,
    comparison,
    applications,
    applicationsMeta,
    id,
    type,
    loading } = props;
  const [names,
    ids,
    avgTotalScores,
    verification,
    flagging,
    establishment,
    unExp,
    budgets] = comparison;
  console.log(comparison);
  return (
    <div>
      <div className={`${classes.gridContainer}`}>
        <div
          style={{
            grid: `none / repeat(${columns}, 1fr)`,
          }}
          className={`${classes.subGrid} ${classes.lightGrey}`}
        >
          {names.map(name => <Typography type="body2">{name}</Typography>)}
        </div>
        <Divider />

        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {ids.map((appId, index) => {
            if (index === 0) return (<Typography>{appId}</Typography>);
            return (<Typography
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
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {avgTotalScores.map(score => <Typography>{score}</Typography>)}
        </div>
        <Divider />

        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {verification.map((singleVerification, index) => {
            if (index === 0) return (<Typography>{singleVerification}</Typography>);
            return (<VerificationText verified={singleVerification} />);
          })}
        </div>
        <Divider />

        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {flagging.map((flag, index) => {
            if (index === 0) return (<Typography>{flag}</Typography>);
            return (<FlaggingStatus flags={flag} noFlagText />);
          })}
        </div>
        <Divider />

        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {establishment.map(year => (<Typography>
            {year}
          </Typography>))}
        </div>
        <Divider />


        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {unExp.map(exp => (<Typography>
            {exp}
          </Typography>))}
        </div>
        <Divider />

        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {budgets.map((budget, index) => {
            if (index === 0) return (<Typography>{budget}</Typography>);
            return (<Typography>
              {budgetOptions[budget]}
            </Typography>);
          })}
        </div>
        <Divider />
      </div>
      <div>
        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          <Typography type="body2">{messages.labelAward}</Typography>
          {applications.map((application, index) => (
            <AwardApplicationButtonContainer
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
            />))}
        </div>
        <Divider />
      </div>
    </div>
  );
};
// (<Button
//   className={classes.button}
//   raised
//   component={Link}
//   to={{
//     pathname: `/cfei/${type}/${id}/applications/${application}`,
//     hash: '#award-open',
//   }}
//   color="accent"
// >
//   {messages.award}
// </Button>)

CompareApplicationContent.propTypes = {
  comparison: PropTypes.array,
  columns: PropTypes.array,
  id: PropTypes.number,
  type: PropTypes.string,
  classes: PropTypes.object,
  applications: PropTypes.array,
  budgetOptions: PropTypes.object,
  loading: PropTypes.bool,
  applicationsMeta: PropTypes.array,
};

const mapStateToProps = state => ({
  budgetOptions: state.partnerProfileConfig['budget-choices'],
});


export default connect(
  mapStateToProps,
)(withStyles(styleSheet, { withTheme: true })(CompareApplicationContent));
