import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import HeaderList from '../../../../../../common/list/headerList';
import { selectRecommendedPartnersCount, selectRecommendedPartners, isUserACreator, isUserAFocalPoint } from '../../../../../../../store';
import { loadRecommendedPartners } from '../../../../../../../reducers/recommendedPartners';
import CollapsableItemAction from '../../../../../../common/collapsableItemAction';
import SpreadContent from '../../../../../../common/spreadContent';
import PaddedContent from '../../../../../../common/paddedContent';
import Pagination from '../../../../../../common/pagination';
import EmptyContent from '../../../../../../common/emptyContent';
import SendRecommendedPartnerButton from '../../../../../buttons/sendForDecisionButton';
import { APPLICATION_STATUSES } from '../../../../../../../helpers/constants';
import { AGENCY_PERMISSIONS, checkPermission } from '../../../../../../../helpers/permissions';
import AwardApplicationButton from '../../../../../buttons/awardApplicationButton';
import WithdrawApplicationButton from '../../../../../buttons/withdrawApplicationButton';
import ItemRecommendation from './itemRecommendation';

const messages = {
  title: 'Recommended Partner(s)',
  button: 'send',
  noInfo: 'No recommended partner(s).',
  criteria: 'Criteria',
  score: 'Average Score',
  totalScore: 'Average total score',
  notes: 'Notes',
  reviewer: 'Reviewer',
  numberOfAssessments: 'Number of completed assessments',
  retracted: 'rectracted',
  selectionJustification: 'Justification for selection',
  retractJustification: 'Justification for retraction',
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
    this.applicationItem = this.applicationItem.bind(this);
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

  applicationItem(application) {
    const { isCreator, isFocalPoint, hasSelectRecommendedPermission } = this.props;

    let action = null;

    if (isCreator || isFocalPoint) {
      if (hasSelectRecommendedPermission) {
        if (application.did_win) {
          if (application.did_withdraw) {
            action = <Button disabled>{messages.retracted}</Button>;
          } else {
            action = (<WithdrawApplicationButton
              disabled={application.did_accept || application.did_decline}
              onUpdate={() => this.props.loadPartners(this.state.params)}
              applicationId={application.id}
            />);
          }
        } else {
          action = (<AwardApplicationButton
            onUpdate={() => this.props.loadPartners(this.state.params)}
            applicationId={application.id}
          />);
        }
      }
    }

    return (<div key={application.id}>
      <CollapsableItemAction
        title={application.partner_additional.legal_name}
        actionComponent={action}
        component={<ItemRecommendation
          assessments={application.assessments}
          averageScores={application.average_scores}
          averageTotalScores={application.average_total_score}
          id={application.id}
        />}
      />
    </div>);
  }

  render() {
    const { cfeiId, loading, partners, count, hasSelectRecommendedPermission, hasRecommendedPartner } = this.props;
    const { params: { page, page_size } } = this.state;

    return (
      <HeaderList
        header={
          <SpreadContent>
            <Typography style={{ margin: 'auto 0' }} type="headline">
              {messages.title}
            </Typography>
            {!hasSelectRecommendedPermission &&
            <SendRecommendedPartnerButton id={cfeiId} />}
          </SpreadContent>
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

RecommendedPartners.propTypes = {
  loading: PropTypes.bool,
  partners: PropTypes.array,
  loadPartners: PropTypes.func,
  count: PropTypes.number,
  cfeiId: PropTypes.number,
  hasSelectRecommendedPermission: PropTypes.bool,
  isFocalPoint: PropTypes.bool,
  isCreator: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const cfeiId = Number(ownProps.params.id);

  return {
    loading: state.recommendedPartners.status.loading,
    partners: selectRecommendedPartners(state, cfeiId),
    count: selectRecommendedPartnersCount(state, cfeiId),
    hasSelectRecommendedPermission:
      checkPermission(AGENCY_PERMISSIONS.CFEI_SELECT_RECOMMENDED_PARTNER, state),
    isFocalPoint: isUserAFocalPoint(state, cfeiId),
    isCreator: isUserACreator(state, cfeiId),
    cfeiId,
    allCriteria: state.selectionCriteria,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPartners: params => dispatch(loadRecommendedPartners(ownProps.params.id, { ...params, status: [APPLICATION_STATUSES.REC].join(',') })),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(RecommendedPartners);
