import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import HeaderList from '../../../../../../common/list/headerList';
import { selectPreselectedPartnersCount, selectPreselectedPartners } from '../../../../../../../store';
import { loadPreselectedPartners } from '../../../../../../../reducers/preselectedPartners';
import CollapsableItemAction from '../../../../../../common/collapsableItemAction';
import SpreadContent from '../../../../../../common/spreadContent';
import PaddedContent from '../../../../../../common/paddedContent';
import Pagination from '../../../../../../common/pagination';
import EmptyContent from '../../../../../../common/emptyContent';
import GridColumn from '../../../../../../common/grid/gridColumn';
import { APPLICATION_STATUSES } from '../../../../../../../helpers/constants';

const messages = {
  title: 'Preselected Partner(s)',
  button: 'send',
  noInfo: 'No preselected partner(s).',
  criteria: 'Criteria',
  score: 'Average Score',
  totalScore: 'Average total score',
  notes: 'Notes',
  reviewer: 'Reviewer',
  numberOfAssessments: 'Number of completed assessments',
};

class PreselectedPartners extends Component {
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
    this.props.loadPartners(this.state.params);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!R.equals(nextState.params, this.state.params)) {
      this.props.loadPartners(nextState.params);
      return false;
    } else if (!this.props.cfeiId && nextProps.cfeiId) {
      this.props.loadPartners(nextState.params);
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

  expandedContent(application) {
    const { allCriteria } = this.props;

    return (<PaddedContent>
      <GridColumn>
        <SpreadContent>
          <Typography type="caption">{messages.criteria}</Typography>
          <Typography type="caption">{messages.score}</Typography>
        </SpreadContent>
        <Divider />
        {R.keys(application.average_scores).map((key, index) => (<div key={index}>
          <SpreadContent>
            <Typography type="body1">{allCriteria[key]}</Typography>
            <Typography type="body1">{application.average_scores[key]}</Typography>
          </SpreadContent>
          <Divider />
        </div>))}
        <SpreadContent>
          <Typography type="body2">{messages.totalScore}</Typography>
          <Typography type="body2">{application.average_total_score}</Typography>
        </SpreadContent>
        <Divider />
        <SpreadContent>
          <Typography type="body2">{messages.numberOfAssessments}</Typography>
          <Typography type="body2">{application.completed_assessments_count}</Typography>
        </SpreadContent>
        <Divider />
        <Typography type="caption">{messages.notes}</Typography>
        {application.assessments.map((item, index) => (<div key={`preselected_reviewer_${index}`}>
          <Typography type="body2">{item.reviewer_fullname}</Typography>
          <Typography type="body1">{item.note ? item.note : '-'}</Typography>
          {((index + 1) < application.assessments.length) && <Divider />}
        </div>))}
      </GridColumn>
    </PaddedContent>);
  }

  applicationItem(application) {
    return (<div key={application.id}>
      <CollapsableItemAction
        title={application.partner_additional.legal_name}
        component={this.expandedContent(application)}
      />
    </div>);
  }

  render() {
    const { loading, partners, count } = this.props;
    const { params: { page, page_size } } = this.state;
    return (
      <HeaderList
        header={
          <Typography style={{ margin: 'auto 0' }} type="headline">
            {messages.title}
          </Typography>
        }
        loading={loading}
      >
        {R.isEmpty(partners) ? loading
          ? <EmptyContent />
          : <PaddedContent big><Typography>{messages.noInfo}</Typography></PaddedContent>
          : partners.map(application => this.applicationItem(application))}
        {!loading && <Grid container justify="center">
          <Grid item>
            <Pagination
              count={count}
              rowsPerPage={page_size}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>}
      </HeaderList>
    );
  }
}

PreselectedPartners.propTypes = {
  loading: PropTypes.bool,
  partners: PropTypes.array,
  loadPartners: PropTypes.func,
  count: PropTypes.number,
  cfeiId: PropTypes.string,
  allCriteria: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.preselectedPartners.status.loading,
  partners: selectPreselectedPartners(state, ownProps.params.id),
  count: selectPreselectedPartnersCount(state, ownProps.params.id),
  cfeiId: ownProps.params.id,
  allCriteria: state.selectionCriteria,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPartners: params => dispatch(loadPreselectedPartners(ownProps.params.id, { ...params, status: APPLICATION_STATUSES.PRE })),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PreselectedPartners);
