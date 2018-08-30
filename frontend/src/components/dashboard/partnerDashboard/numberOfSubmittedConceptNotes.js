import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import PaddedContent from '../../common/paddedContent';
import GridColumn from '../../common/grid/gridColumn';
import SpreadContent from '../../common/spreadContent';
import DonutChart from '../../common/charts/pieChart';
import { chartColors } from '../../../styles/muiTheme';

const messages = {
  title: 'Number Of Applications Submitted by UN Agency',
};

const styleSheet = () => ({
  paper: {
    height: '100%',
  },
});

const NumberOfSubmittedConceptNotes = (props) => {
  const { numSubmittedCN: total, numSubmittedCNByAgency: data = [], classes } = props;
  const newData = data.map(({ name, count }) => ({ name, value: count }));
  return (
    <Paper className={classes.paper}>
      <PaddedContent>
        <GridColumn>
          <Typography type="headline">{messages.title}</Typography>
          <DonutChart
            colors={chartColors}
            label={`${total}`}
            data={newData}
            containerProps={{
              width: '100%',
              height: 200,
            }}
            pieProps={{
              dataKey: 'value',
            }}
          />
          {newData.map(({ name, value }, index) => (
            <div key={`name_${index}`}>
              <GridColumn spacing={8}>
                <SpreadContent>
                  <Grid container alignItems="center">
                    <Grid item>
                      <div style={{ height: 24, width: 8, background: chartColors[index] }} />
                    </Grid>
                    <Grid item>
                      <Typography>{name}</Typography>
                    </Grid>
                  </Grid>
                  {value}
                </SpreadContent>
                <Divider />
              </GridColumn>
            </div>))}
        </GridColumn>
      </PaddedContent>
    </Paper>
  );
};

NumberOfSubmittedConceptNotes.propTypes = {
  numSubmittedCN: PropTypes.number,
  numSubmittedCNByAgency: PropTypes.array,
  classes: PropTypes.object,
};

export default withStyles(styleSheet,
  { name: 'NumberOfSubmittedConceptNotes' })(NumberOfSubmittedConceptNotes);
