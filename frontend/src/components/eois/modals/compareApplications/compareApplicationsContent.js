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

const messages = {
  labelAward: 'Select comparison(s) you want to award',
  award: 'Award',
};

const styleSheet = theme => ({
  lightGrey: {
    // width: '100%',
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
    id,
    type } = props;
  const [names, ids, avgTotalScores, verification, flagging, unExp, budgets] = comparison;
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
            return (<Typography>
              <VerificationText verified={singleVerification} />
            </Typography>);
          })}
        </div>
        <Divider />

        <div
          style={{ grid: `none / repeat(${columns}, 1fr)` }}
          className={classes.subGrid}
        >
          {flagging.map((flag, index) => {
            if (index === 0) return (<Typography>{flag}</Typography>);
            return (<Typography>
              <FlaggingStatus flags={flag} noFlagText />
            </Typography>);
          })}
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
          {applications.map(application =>
            (<Button
              className={classes.button}
              raised
              component={Link}
              to={{
                pathname: `/cfei/${type}/${id}/applications/${application}`,
                hash: '#award-open',
              }}
              color="accent"
            >
              {messages.award}
            </Button>))}
        </div>
        <Divider />
      </div>
    </div>
  );
};


CompareApplicationContent.propTypes = {
  comparison: PropTypes.array,
  columns: PropTypes.array,
  id: PropTypes.number,
  type: PropTypes.string,
  classes: PropTypes.object,
  applications: PropTypes.array,
  budgetOptions: PropTypes.object,
};

const mapStateToProps = state => ({
  budgetOptions: state.partnerProfileConfig['budget-choices'],
});


export default connect(
  mapStateToProps,
)(withStyles(styleSheet, { withTheme: true })(CompareApplicationContent));
