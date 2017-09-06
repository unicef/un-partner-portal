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
import Loader from '../loader';


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
    const { classes, columnData, title, renderTableCells, loading } = this.props;
    const { data, order, orderBy } = this.state;

    return (
      <Paper >
        {title && <EnhancedTableToolbar
          title={title}
          numSelected={0}
        />}
        <Paper elevation={0} className={classes.paper}>
          <Loader loading={loading && !data.length} >
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                columnData={columnData}
                firstCell={classes.firstCell}
              />
              {loading && !data.length
                ? (
                  <TableBody>
                    <TableRow />
                    <TableRow />
                    <TableRow />
                    <TableRow />
                  </TableBody>)
                : (<TableBody>
                  {data.map(n => (
                    <TableRow
                      hover
                      onMouseLeave={this.handleMouseLeave}
                      onMouseEnter={this.handleMouseEnter(n.id)}
                      tabIndex="-1"
                      key={n.id}
                    >
                      {renderTableCells(n, classes)}
                    </TableRow>
                  ))}
                </TableBody>)
              }
            </Table>
          </Loader>
        </Paper>
      </Paper>
    );
  }
}

RegularTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  columnData: PropTypes.array.isRequired,
  renderTableCells: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withStyles(styleSheet)(RegularTable);
