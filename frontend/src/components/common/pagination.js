
import React, { Component } from 'react';
import withStyles from 'material-ui/styles/withStyles';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';

export const styles = theme => ({
  root: {
    // Increase the specificity to override TableCell.
    '&:last-child': {
      padding: 0,
    },
  },
  toolbar: {
    height: 56,
    minHeight: 56,
    paddingRight: 2,
  },
  spacer: {
    flex: '1 1 100%',
  },
  caption: {
    flexShrink: 0,
  },
  selectRoot: {
    marginRight: theme.spacing.unit * 4,
  },
  select: {
    marginLeft: theme.spacing.unit,
    width: 34,
    textAlign: 'right',
    paddingRight: 22,
    color: theme.palette.text.secondary,
    height: 32,
    lineHeight: '32px',
  },
  actions: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});


class Pagination extends Component {
  constructor() {
    super();
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
  }
  componentWillReceiveProps({ count, onChangePage, rowsPerPage }) {
    const newLastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  }

  handleBackButtonClick(event) {
    this.props.onChangePage(event, this.props.page - 1);
  }

  handleNextButtonClick(event) {
    this.props.onChangePage(event, this.props.page + 1);
  }

  render() {
    const {
      classes,
      colSpan: colSpanProp,
      count,
      labelDisplayedRows,
      labelRowsPerPage,
      onChangePage,
      onChangeRowsPerPage,
      page,
      rowsPerPage,
      rowsPerPageOptions,
      ...other
    } = this.props;

    let colSpan;

    return (
      <div className={classes.root} colSpan={colSpan} {...other}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.spacer} />
          <Typography type="caption" className={classes.caption}>
            {labelRowsPerPage}
          </Typography>
          <Select
            classes={{ root: classes.selectRoot, select: classes.select }}
            input={<Input disableUnderline />}
            value={rowsPerPage}
            onChange={(event) => { onChangeRowsPerPage(event); }}
          >
            {rowsPerPageOptions.map(rowsPerPageOption => (
              <MenuItem key={rowsPerPageOption} value={rowsPerPageOption}>
                {rowsPerPageOption}
              </MenuItem>
            ))}
          </Select>
          <Typography type="caption" className={classes.caption}>
            {labelDisplayedRows({
              from: count === 0 ? 0 : (page - 1) * rowsPerPage + 1,
              to: Math.min(count, (page) * rowsPerPage),
              count,
              page,
            })}
          </Typography>
          <div className={classes.actions}>
            <IconButton onClick={this.handleBackButtonClick} disabled={page === 1}>
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage)}
            >
              <KeyboardArrowRight />
            </IconButton>
          </div>
        </Toolbar>
      </div>
    );
  }
}

Pagination.defaultProps = {
  labelRowsPerPage: 'Items per page:',
  labelDisplayedRows: ({ from, to, count }) => `${from}-${to} of ${count}`,
  rowsPerPageOptions: [5, 10, 15],
};

export default withStyles(styles, { name: 'Pagination' })(Pagination);
