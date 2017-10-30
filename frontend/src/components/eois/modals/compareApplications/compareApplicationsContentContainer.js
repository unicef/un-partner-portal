import React, { Component } from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { withRouter, Link, browserHistory as history } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import { pluckAll } from '../../../../reducers/normalizationHelpers';

const messages = {
  labelAward: 'Select Partners(s) you want to award',
  award: 'Award',
};
const labels = {
  legal_name: 'Partner',
  id: 'Concept Note Id',
  average_total_score: 'Total Assessment Score',
};

const mapProperties = pluckAll(R.keys(labels));

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

class CompareApplicationContentContainer extends Component {
  constructor() {
    super();
    this.state = { isPrinting: false };
    this.print = this.print.bind(this);
  }


  print() {
    const { gridSection, printSection } = this;
    const printWindow = printSection.contentWindow;
    printWindow.document.open();
    printWindow.document.write(gridSection.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  render() {
    let { classes, partners, params: { id, type } } = this.props;
    const { isPrinting } = this.state;
    partners = R.prepend(labels, partners);
    const [names, ids, avgTotalScores] = mapProperties(partners);
    const columns = partners.length;
    return (
      <div>
        <iframe
          title="print-section"
          id="print-section"
          className={classes.iframe}
          ref={(node) => { this.printSection = node; }}
        />
        <div ref={(node) => { this.gridSection = node; }} className={`${classes.gridContainer}`}>
          <div
            style={{
              media: 'print',
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
        </div>
        <div>
          <div
            style={{ grid: `none / repeat(${columns}, 1fr)` }}
            className={classes.subGrid}
          >
            <Typography type="body2">{messages.labelAward}</Typography>
            {R.drop(1, partners).map(partner =>
              (<Button
                className={classes.button}
                raised
                component={Link}
                to={{
                  pathname: `/cfei/${type}/${id}/applications/${partner.id}`,
                  hash: '#award-open',
                }}
                color="accent"
              >
                {messages.award}
              </Button>))}
          </div>
          <Divider />
          <Grid container justify="flex-end">
            <Grid item>
              <Button color="accent" onClick={() => window.print()}>Print</Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

CompareApplicationContentContainer.propTypes = {
  partners: PropTypes.array,
};

export default withRouter(
  withStyles(styleSheet, { withTheme: true })(CompareApplicationContentContainer));
