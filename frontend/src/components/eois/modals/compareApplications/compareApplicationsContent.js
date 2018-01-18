import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import VerificationText from '../../../partners/profile/common/verificationText';
import FlaggingStatus from '../../../partners/profile/common/flaggingStatus';
import AwardApplicationButtonContainer from '../../buttons/awardApplicationButtonContainer';
import { APPLICATION_STATUSES } from '../../../../helpers/constants';

const messages = {
  labelAward: 'Choose successful applicant(s)',
  award: 'Award',
  print: 'Print',
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
    this.print = this.print.bind(this);
  }

  print() {
    const printWindow = this.printWindow.contentWindow;
    printWindow.document.open();
    printWindow.document.title = 'comparison';
    printWindow.document.write(this.comparisonContent.innerHTML);
    const currentStyleSheet = document.querySelectorAll('style');
    const head = printWindow.document.head;
    currentStyleSheet.forEach((style) => {
      const newStyle = printWindow.document.createElement('style');
      newStyle.type = 'text/css';
      newStyle.textContent = style.textContent;
      head.appendChild(newStyle);
    });
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
      loading } = this.props;
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
            }}
            className={`${classes.subGrid} ${classes.lightGrey}`}
          >
            {names.map((name, index) => <Typography key={ids[index]} type="body2">{name}</Typography>)}
          </div>
          <Divider />

          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {ids.map((appId, index) => {
              if (index === 0) return (<Typography key={appId}>{appId}</Typography>);
              return (<Typography
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
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {avgTotalScores.map((score, index) => <Typography key={ids[index]}>{score}</Typography>)}
          </div>
          <Divider />

          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {verification.map((singleVerification, index) => {
              if (index === 0) return (<Typography key={ids[index]}>{singleVerification}</Typography>);
              return (<VerificationText key={ids[index]} verified={singleVerification} />);
            })}
          </div>
          <Divider />

          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {flagging.map((flag, index) => {
              if (index === 0) return (<Typography key={ids[index]}>{flag}</Typography>);
              return (<FlaggingStatus key={ids[index]} flags={flag} noFlagText />);
            })}
          </div>
          <Divider />

          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {establishment.map((year, index) => (<Typography key={ids[index]}>
              {year}
            </Typography>))}
          </div>
          <Divider />


          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {unExp.map((exp, index) => (<Typography key={ids[index]}>
              {exp}
            </Typography>))}
          </div>
          <Divider />

          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            {budgets.map((budget, index) => {
              if (index === 0) return (<Typography key={ids[index]}>{budget}</Typography>);
              return (<Typography className={classes.wrappedText} key={ids[index]}>
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
              />))}
          </div>
          <Divider />
        </div>
        <Grid container justify="flex-end">
          <Grid item>
            <Button className={classes.printButton} onClick={this.print} color="accent">{messages.print}</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
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
  columns: PropTypes.number,
  id: PropTypes.string,
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
