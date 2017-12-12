// eslint-disable-next-line
import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import {
  calculatePaginatedPage,
} from '../../../helpers/apiHelper';

class TableWithLocalState extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 1, page_size: 10 };
    this.changeSorting = this.changeSorting.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.changePageNumber = this.changePageNumber.bind(this);
  }

  componentWillMount() {
    this.props.loadingFunction(this.state);
  }

  changePageSize(pageSize) {
    const { itemsCount, loadingFunction } = this.props;
    const { page } = this.state;
    const newPageNumber = calculatePaginatedPage(page, pageSize, itemsCount);
    const newState = R.merge(this.state, { page: newPageNumber + 1, page_size: pageSize });
    loadingFunction(newState);
    this.setState(newState);
  }

  changePageNumber(page) {
    const { loadingFunction } = this.props;
    const newState = R.merge(this.state, { page: page + 1 });
    loadingFunction(newState);
    this.setState(newState);
  }

  changeSorting(sorting) {
    const { loadingFunction } = this.props;
    const direction = sorting[0].direction === 'desc' ? '-' : '';
    const newState = R.merge(this.state, { ordering: direction + sorting[0].columnName });
    loadingFunction(newState);
    this.setState({ sorting, ...newState });
  }

  render() {
    const { component: WrappedComponent, ...other } = this.props;
    return (<WrappedComponent
      {...other}
      allowSorting
      sorting={this.state.sorting}
      changeSorting={this.changeSorting}
      changePageSize={this.changePageSize}
      changePageNumber={this.changePageNumber}
      pageSize={this.state.page_size}
      pageNumber={this.state.page}
    />);
  }
}

TableWithLocalState.propTypes = {
  component: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
  ]).isRequired,
  itemsCount: PropTypes.number,
  loadingFunction: PropTypes.func,
};


export default TableWithLocalState;
