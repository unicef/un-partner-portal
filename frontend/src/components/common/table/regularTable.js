import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Table, {
  TableBody,
  TableRow,

} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import EnhancedTableToolbar from './enhancedTableToolbar';
import EnhancedTableHead from './enhancedTableHead';
import SharedTable from './sharedTable';


const styleSheet = createStyleSheet('RegularTable', theme => ({
  root: {
    background: theme.palette.primary[200],
    padding: theme.spacing.unit * 3,
  },
  paper: {
    width: '100%',
    overflowX: 'scroll',
  },
  limitedCell: {
    maxWidth: 250,
  },
  firstCell: {
    padding: `0px 4px 0px ${theme.spacing.unit * 4}px`,
  },
}));

class RegularTable extends SharedTable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      ...{
        selectable: false,
      },
    };
  }

  render() {
    const { classes, columnData, title, renderCells } = this.props;
    const { data, order, orderBy } = this.state;

    return (
      <Paper elevation={0} className={classes.root}>
        <Paper >
          <EnhancedTableToolbar
            title={title}
            numSelected={0}
          />
          <Paper elevation={0} className={classes.paper}>
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                columnData={columnData}
                firstCell={classes.firstCell}
              />
              <TableBody>
                {data.map(n => (
                  <TableRow
                    hover
                    onMouseLeave={this.handleMouseLeave}
                    onMouseEnter={this.handleMouseEnter(n.id)}
                    tabIndex="-1"
                    key={n.id}
                  >
                    {renderCells(n, this.state, classes)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Paper>
      </Paper>
    );
  }
}

RegularTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  columnData: PropTypes.array.isRequired,
  renderCells: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(RegularTable);
