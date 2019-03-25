import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import HeaderList from '../../../../../../common/list/headerList';
import {
  selectRecommendedPartnersCount, selectRecommendedPartners,
  isCfeiCompleted, isUserACreator, isUserAFocalPoint, selectCfeiReviewSummary,
} from '../../../../../../../store';
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
import ButtonWithTooltip from '../../../../../../common/buttonWithTooltipEnabled';

const messages = {
  accepted: 'Accepted',
  declined: 'Declined',
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
  select: 'select',
  selectInfo: 'Provide review summary before selecting partner.',
  verifiedInfo: 'Partner Profile is not verified, please verify before selecting.',
  sanctionMatch: 'Partner has confirmed match on sanctions list and can not be selected.',
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
    const { isCreator, isFocalPoint, hasSelectRecommendedPermission, summary, isCompleted } = this.props;

    let action = null;

    if (isCreator || isFocalPoint) {
      if (hasSelectRecommendedPermission) {
        if (application.did_win) {
          if (application.did_withdraw) {
            action = <Button disabled>{messages.retracted}</Button>;
          } else if (application.did_accept) {
            action = <Button style={{ color: '#72C300' }} disabled>{messages.accepted}</Button>;
          } else if (application.did_decline) {
            action = <Button style={{ color: '#EA4022' }} disabled>{messages.declined}</Button>;
          } else {
            action = (<WithdrawApplicationButton
              disabled={application.did_accept || application.did_decline}
              onUpdate={() => this.props.loadPartners(this.state.params)}
              applicationId={application.id}
              isCompleted={isCompleted}
            />);
          }
        } else if (!summary.review_summary_comment) {
          action = (<ButtonWithTooltip
            name="select"
            disabled
            text={messages.select}
            tooltipText={messages.selectInfo}
          />);
        } else if (!application.partner_additional.is_verified) {
          action = (<ButtonWithTooltip
            name="select"
            disabled
            text={messages.select}
            tooltipText={messages.verifiedInfo}
          />);
        } else if (application.partner_additional.has_potential_sanction_match) {
          action = (<ButtonWithTooltip
            name="select"
            disabled
            text={messages.select}
            tooltipText={messages.sanctionMatch}
          />);
        } else {
          action = (<AwardApplicationButton
            onUpdate={() => this.props.loadPartners(this.state.params)}
            applicationId={application.id}
            isCompleted={isCompleted}
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
    const { cfeiId, loading, partners, count, hasSelectRecommendedPermission } = this.props;
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
  summary: PropTypes.object,
  isCreator: PropTypes.bool,
  isCompleted: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const cfeiId = Number(ownProps.params.id);

  return {
    loading: state.recommendedPartners.status.loading,
    partners: selectRecommendedPartners(state, cfeiId),
    count: selectRecommendedPartnersCount(state, cfeiId),
    summary: selectCfeiReviewSummary(state, ownProps.id),
    hasSelectRecommendedPermission:
      checkPermission(AGENCY_PERMISSIONS.CFEI_SELECT_RECOMMENDED_PARTNER, state),
    isFocalPoint: isUserAFocalPoint(state, cfeiId),
    isCreator: isUserACreator(state, cfeiId),
    cfeiId,
    allCriteria: state.selectionCriteria,
    isCompleted: isCfeiCompleted(state, ownProps.id),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadPartners: params => dispatch(loadRecommendedPartners(ownProps.params.id, { ...params, status: [APPLICATION_STATUSES.REC].join(',') })),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(RecommendedPartners);
