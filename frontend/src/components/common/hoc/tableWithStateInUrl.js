// eslint-disable-next-line
import React, { Component } from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { browserHistory as history, withRouter } from 'react-router';
import { connect } from 'react-redux';
import {
  updateOrder,
  calculatePaginatedPage,
  updatePageNumberSize,
  updatePageNumber,
} from '../../../helpers/apiHelper';

class TableWithStateInUrl extends Component {
  constructor(props) {
    super(props);
    this.state = { page: 1, page_size: 10 };
    this.changeSorting = this.changeSorting.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.changePageNumber = this.changePageNumber.bind(this);

    // TODO - move default order to this component
  }

  componentWillReceiveProps(nextProps) {
    const { pathName, query = {} } = nextProps;
    if (!query.page || !query.page_size) {
      history.push({
        pathname: pathName,
        query: R.merge(query, { page: this.state.page, page_size: this.state.page_size }),
      });
    }
  }

  changePageSize(pageSize) {
    const { pageNumber, itemsCount, pathName, query } = this.props;
    updatePageNumberSize(calculatePaginatedPage(pageNumber, pageSize, itemsCount),
      pageSize, pathName, query);
  }

  changePageNumber(page) {
    const { pathName, query } = this.props;
    updatePageNumber(page, pathName, query);
  }

  changeSorting(sorting) {
    const { pathName, query } = this.props;
    this.setState({
      sorting,
    });

    const direction = sorting[0].direction === 'desc' ? '-' : '';
    updateOrder(sorting[0].columnName, direction, pathName, query);
  }

  render() {
    const { component: WrappedComponent, pageSize, pageNumber, ...other } = this.props;
    return (<WrappedComponent
      {...other}
      allowSorting
      sorting={this.state.sorting}
      changeSorting={this.changeSorting}
      changePageSize={this.changePageSize}
      changePageNumber={this.changePageNumber}
      pageSize={pageSize}
      pageNumber={pageNumber}
    />);
  }
}

TableWithStateInUrl.propTypes = {
  component: PropTypes.element,
  query: PropTypes.object,
  pathName: PropTypes.string,
  pageSize: PropTypes.number,
  pageNumber: PropTypes.number,
  itemsCount: PropTypes.number,
};


const mapStateToProps = (state, ownProps) => ({
  pathName: ownProps.location.pathname,
  query: ownProps.location.query,
  pageSize: ownProps.location.query.page_size,
  pageNumber: ownProps.location.query.page,
});

export default withRouter(connect(mapStateToProps, null)(TableWithStateInUrl));
