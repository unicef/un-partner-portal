import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import { selectClarificationRequests, selectClarificationRequestsCount } from '../../../../../store';
import { loadClarificationRequests } from '../../../../../reducers/clarificationRequests';
import PaddedContent from '../../../../common/paddedContent';
import { formatDateForPrint } from '../../../../../helpers/dates';
import Pagination from '../../../../common/pagination';
import EmptyContent from '../../../../common/emptyContent';
import GridColumn from '../../../../common/grid/gridColumn';
import GridRow from '../../../../common/grid/gridRow';

const messages = {
  noInfo: 'No additional information/clarification request(s).',
  comment: 'Comments',
  requestBy: 'Request made by',
  organizationName: 'Organization name',
  date: 'Date Submitted',
};

class ClarificationRequests extends Component {
  constructor() {
    super();
    this.state = {
      params: {
        page: 1,
        page_size: 2,
      },
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.requestItem = this.requestItem.bind(this);
  }

  componentWillMount() {
    this.props.loadRequests(this.state.params);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!R.equals(nextState.params, this.state.params)) {
      this.props.loadRequests(nextState.params);
      return false;
    } else if (!this.props.cfeiId && nextProps.cfeiId) {
      this.props.loadRequests(nextState.params);
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

  /* eslint-disable class-methods-use-this */
  requestItem(request) {
    return (<GridColumn key={request.id} style={{ minWidth: '50vw' }}>
      <div>
        <Typography type="caption">{messages.comment}</Typography>
        <Typography type="body1">{request.question || '-'}</Typography>
      </div>
      <GridRow columns={3}>
        <div>
          <Typography type="caption">{messages.requestBy}</Typography>
          <Typography type="body1">{request.created_by.name || '-'}</Typography>
        </div>
        <div>
          <Typography type="caption">{messages.organizationName}</Typography>
          <Typography type="body1">{request.partner.legal_name || '-'}</Typography>
        </div>
        <div>
          <Typography type="caption">{messages.date}</Typography>
          <Typography type="body1">{formatDateForPrint(request.created) || '-'}</Typography>
        </div>
      </GridRow>
      <Divider />
    </GridColumn>);
  }

  render() {
    const { loading, requests, count } = this.props;
    const { params: { page, page_size } } = this.state;

    return (
      <React.Fragment>
        {R.isEmpty(requests) ? loading
          ? <EmptyContent />
          : <PaddedContent big><Typography>{messages.noInfo}</Typography></PaddedContent>
          : requests.map(request => this.requestItem(request))}
        {!loading && <Grid container justify="center">
          <Grid item>
            <Pagination
              rowsPerPageOptions={[1, 2, 5]}
              count={count}
              rowsPerPage={page_size}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>}
      </React.Fragment>
    );
  }
}

ClarificationRequests.propTypes = {
  loading: PropTypes.bool,
  requests: PropTypes.array,
  loadRequests: PropTypes.func,
  count: PropTypes.number,
  cfeiId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const cfeiId = Number(ownProps.params.id);

  return {
    loading: state.clarificationRequests.status.loading,
    requests: selectClarificationRequests(state, cfeiId),
    count: selectClarificationRequestsCount(state, cfeiId),
    cfeiId,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadRequests: params => dispatch(loadClarificationRequests(ownProps.params.id, params)),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ClarificationRequests);
