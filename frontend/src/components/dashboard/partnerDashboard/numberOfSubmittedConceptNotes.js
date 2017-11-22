import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import PaddedContent from '../../common/paddedContent';
import GridColumn from '../../common/grid/gridColumn';
import SpreadContent from '../../common/spreadContent';
import DonutChart from '../../common/charts/pieChart';
import { chartColors } from '../../../styles/muiTheme';


const messages = {
  title: 'Number Of Applications Submitted by UN Agency',
};

const NumberOfSubmittedConceptNotes = (props) => {
  const { numSubmittedCN: total, numSubmittedCNByAgency: data = [] } = props;
  const newData = data.map(({ name, count }) => ({ name, value: count }));
  return (
    <Paper>
      <PaddedContent>
        <GridColumn>
          <Typography type="headline">{messages.title}</Typography>
          <DonutChart colors={chartColors} label={total} data={newData} />
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
                  <Typography>{value}</Typography>
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
};

export default NumberOfSubmittedConceptNotes;
