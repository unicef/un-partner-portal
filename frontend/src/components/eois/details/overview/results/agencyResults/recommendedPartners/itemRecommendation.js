import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withRouter } from 'react-router';
import Divider from 'material-ui/Divider';
import SpreadContent from '../../../../../../common/spreadContent';
import PaddedContent from '../../../../../../common/paddedContent';
import GridColumn from '../../../../../../common/grid/gridColumn';
import { loadApplication } from '../../../../../../../reducers/applicationDetails';
import Loader from '../../../../../../common/loader';
import { selectApplication } from '../../../../../../../store';
import { formatDateForPrint } from '../../../../../../../helpers/dates';

const messages = {
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
  componentWillMount() {
    this.props.loadApplicationDetails();
  }

  render() {
    const { loading, application, allCriteria, assessments, averageScores, averageTotalScores } = this.props;

    return (
      <PaddedContent>
        <Loader loading={loading}>
          {application && <GridColumn>
            <SpreadContent>
              <Typography type="caption">{messages.criteria}</Typography>
              <Typography type="caption">{messages.score}</Typography>
            </SpreadContent>
            <Divider />
            {averageScores
                 && R.keys(averageScores).map((key, index) => (<div key={index}>
                   <SpreadContent>
                     <Typography type="body1">{allCriteria[key]}</Typography>
                     <Typography type="body1">{averageScores[key]}</Typography>
                   </SpreadContent>
                   <Divider />
                 </div>))}
            <SpreadContent>
              <Typography type="body2">{messages.totalScore}</Typography>
              <Typography type="body2">{averageTotalScores || '-'}</Typography>
            </SpreadContent>
            <Divider />
            <SpreadContent>
              <Typography type="body2">{messages.numberOfAssessments}</Typography>
              <Typography type="body2">{application.completed_assessments_count}</Typography>
            </SpreadContent>
            <Divider />
            <SpreadContent>
              <Typography type="caption">{messages.notes}</Typography>
            </SpreadContent>
            {assessments
                 && assessments.map((item, index) => (<div key={`recommended_reviewer_${index}`}>
                   <Typography type="body2">{item.reviewer_fullname}</Typography>
                   <Typography type="body1">{item.note ? item.note : '-'}</Typography>
                   {((index + 1) < assessments.length) && <Divider />}
                 </div>))}
            {application.did_win &&
              <Divider />}
            {application.did_win && <div>
              <SpreadContent>
                <Typography type="caption">{messages.selectionJustification}</Typography>
              </SpreadContent>
              <Typography type="body2">{`${application.agency_decision_maker ? application.agency_decision_maker.name : ''} ${application.agency_decision_date ? formatDateForPrint(application.agency_decision_date) : ''}`}</Typography>
              <Typography type="body1">{application.justification_reason ? application.justification_reason : '-'}</Typography>
            </div>}
            {application.did_withdraw &&
              <Divider />}
            {application.did_withdraw && <div>
              <SpreadContent>
                <Typography type="caption">{messages.retractJustification}</Typography>
              </SpreadContent>
              <Typography type="body1">{application.withdraw_reason ? application.withdraw_reason : '-'}</Typography>
            </div>}
          </GridColumn>}
        </Loader>
      </PaddedContent>);
  }
}

RecommendedPartners.propTypes = {
  loading: PropTypes.bool,
  application: PropTypes.object,
  loadApplicationDetails: PropTypes.func,
  allCriteria: PropTypes.object,
  assessments: PropTypes.array,
  averageScores: PropTypes.array,
  averageTotalScores: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  application: selectApplication(state, ownProps.id) || {},
  loading: state.applicationDetails.status.loading,
  allCriteria: state.selectionCriteria,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadApplicationDetails: () => dispatch(loadApplication(ownProps.id)),
});

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(RecommendedPartners);
