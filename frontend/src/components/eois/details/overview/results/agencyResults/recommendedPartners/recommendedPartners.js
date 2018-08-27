import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import HeaderList from '../../../../../../common/list/headerList';
import { selectRecommendedPartnersCount, selectRecommendedPartners } from '../../../../../../../store';
import { loadRecommendedPartners } from '../../../../../../../reducers/recommendedPartners';
import CollapsableItemAction from '../../../../../../common/collapsableItemAction';
import SpreadContent from '../../../../../../common/spreadContent';
import PaddedContent from '../../../../../../common/paddedContent';
import { formatDateForPrint } from '../../../../../../../helpers/dates';
import Pagination from '../../../../../../common/pagination';
import EmptyContent from '../../../../../../common/emptyContent';
import SendRecommendedPartnerButton from '../../../../../buttons/sendRecommendedPartnerButton';
import GridColumn from '../../../../../../common/grid/gridColumn';
import { APPLICATION_STATUSES } from '../../../../../../../helpers/constants';

const messages = {
  title: 'Recommended Partner(s)',
  button: 'send',
  noInfo: 'No information available yet.',
  criteria: 'Criteria',
  score: 'Average Score',
  totalScore: 'Average total score',
  notes: 'Notes',
  reviewer: 'Reviewer',
  numberOfAssessments: 'Number of completed assessments',
};

class RecommendedPartners extends Component {
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
            <Typography>{allCriteria[key]}</Typography>
            <Typography>{application.average_scores[key]}</Typography>
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
        <SpreadContent>
          <Typography type="caption">{messages.notes}</Typography>
          <Typography type="caption">{messages.reviewer}</Typography>
        </SpreadContent>
        {R.map((item, index) => (<div key={index}>
          <SpreadContent>
            <Typography>{item.note}</Typography>
            <Typography>{item.reviewer_fullname}</Typography>
          </SpreadContent>
          {((index + 1) < application.assessments.length) && <Divider />}
        </div>), application.assessments)}
      </GridColumn>
    </PaddedContent>);
  }

  applicationItem(application) {
    return (<div key={application.id}>
      <CollapsableItemAction
        title={application.partner_additional.legal_name}
        actionComponent={<SendRecommendedPartnerButton id={application.id} />}
        component={this.expandedContent(application)}
      />
      <Divider />
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
        <Grid container justify="center">
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
      </HeaderList>
    );
  }
}

RecommendedPartners.propTypes = {
  loading: PropTypes.bool,
  partners: PropTypes.array,
  loadPartners: PropTypes.func,
  count: PropTypes.number,
  cfeiId: PropTypes.string,
  allCriteria: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.recommendedPartners.status.loading[ownProps.params.cfeiId],
  partners: selectRecommendedPartners(state, ownProps.params.cfeiId),
  count: selectRecommendedPartnersCount(state, ownProps.params.cfeiId),
  cfeiId: ownProps.params.id,
  allCriteria: state.selectionCriteria,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPartners: params => dispatch(loadRecommendedPartners(ownProps.params.id, { ...params, status: APPLICATION_STATUSES.REC })),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(RecommendedPartners);
