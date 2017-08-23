import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableRow,

} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import EnhancedTableToolbar from './enhancedTableToolbar';
import EnhancedTableHead from './enhancedTableHead';
import SharedTable from './sharedTable';
import TableStyleSheet from './tableStyling';


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
    const { classes, columnData, title, renderTableCells } = this.props;
    const { data, order, orderBy } = this.state;

    return (
      <Paper >
        {title && <EnhancedTableToolbar
          title={title}
          numSelected={0}
        />}
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
                  {renderTableCells(n, classes)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default withStyles(TableStyleSheet)(RegularTable);
