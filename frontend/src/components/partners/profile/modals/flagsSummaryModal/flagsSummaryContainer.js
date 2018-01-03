import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty, equals } from 'ramda';
import Grid from 'material-ui/Grid';
import EmptyContent from '../../../../common/emptyContent';
import { selectPartnerFlags, selectPartnerFlagsCount } from '../../../../../store';
import { loadPartnerFlags } from '../../../../../reducers/partnerFlags';
import SingleFlagSummary from './singleFlagSummary';
import Pagination from '../../../../common/pagination';
import Loader from '../../../../common/loader';


class FlagSummaryContainer extends Component {
  constructor() {
    super();
    this.state = {
      params: {
        page: 1,
        page_size: 5,
      },
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentWillMount() {
    this.props.getFlags(this.state.params);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!equals(nextState.params, this.state.params)) {
      this.props.getFlags(nextState.params);
      return false;
    }
    return true;
  }

  handleChangePage(event, page) {
    this.setState({ params: { ...this.state.params, page } });
  }

  handleChangeRowsPerPage(event) {
    this.setState({ params: { ...this.state.params, page_size: event.target.value } });
  }

  render() {
    const { loading, flags, count } = this.props;
    const { params: { page, page_size } } = this.state;
    if (loading && isEmpty(flags)) {
      return <EmptyContent />;
    }
    return (
      <Loader loading={loading}>
        {flags.map(flag =>
          <SingleFlagSummary key={flag.id} form={`flagSummary_${flag.id}`} initialValues={flag} flag={flag} />)}
        <Grid container justify="center" >
          <Grid item>
            <Pagination
              count={count}
              rowsPerPage={page_size}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Loader>);
  }
}

FlagSummaryContainer.propTypes = {
  flags: PropTypes.array,
  loading: PropTypes.bool,
  getFlags: PropTypes.func,
  count: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.partnerFlags.status.loading,
  count: selectPartnerFlagsCount(state, ownProps.params.id),
  flags: selectPartnerFlags(state, ownProps.params.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getFlags: params => dispatch(loadPartnerFlags(ownProps.params.id, params)),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FlagSummaryContainer));
