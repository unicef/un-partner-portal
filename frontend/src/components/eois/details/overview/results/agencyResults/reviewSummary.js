import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import Typography from 'material-ui/Typography';
import PaddedContent from '../../../../../common/paddedContent';
import EmptyContent from '../../../../../common/emptyContent';
import HeaderList from '../../../../../common/list/headerList';
import { isUserAFocalPoint, selectCfeiReviewSummary, isUserACreator, isCfeiDeadlinePassed, isSendForDecision } from '../../../../../../store';
import { loadReviewSummary } from '../../../../../../reducers/cfeiReviewSummary';
import ChangeSummaryButton from '../../../../buttons/changeSummaryButton';
import ReviewSummaryForm from '../../../../modals/changeSummary/changeSummaryForm';
import { checkPermission, AGENCY_PERMISSIONS, AGENCY_ROLES, isRoleOffice } from '../../../../../../helpers/permissions';

const messages = {
  title: 'Review Summary',
  empty: 'No Review Summary added yet',
};

class ReviewSummary extends Component {
  constructor(props) {
    super(props);

    this.isActionAllowed = this.isActionAllowed.bind(this);
  }

  componentWillMount() {
    this.props.getReviewSummary();
  }

  isActionAllowed(hasActionPermission) {
    const {
      isAdvEd,
      isPAM,
      isMFT,
      isBasEd,
      isCreator,
      isSend,
      isFocalPoint } = this.props;

    return ((hasActionPermission && isAdvEd && (isCreator || isFocalPoint))
    || (hasActionPermission && isBasEd && isCreator && !isSend)
    || (hasActionPermission && isMFT && isFocalPoint)
    || (hasActionPermission && isPAM && isCreator));
  }

  content() {
    const { id, loading, summary, hasAddSummaryPermission, deadlinePassed } = this.props;
    if (loading) {
      return <EmptyContent />;
    } else if (!summary || isEmpty(summary)) {
      return (<PaddedContent>
        <Typography>
          {messages.empty}
        </Typography>
        {this.isActionAllowed(hasAddSummaryPermission) && <ChangeSummaryButton
          cfeiId={id}
          edit={!!summary.review_summary_comment}
        />}
      </PaddedContent>);
    }
    return (
      <PaddedContent>
        <ReviewSummaryForm form="changeSummaryReadOnly" readOnly cfeiId={id} />
        {deadlinePassed && this.isActionAllowed(hasAddSummaryPermission) && <ChangeSummaryButton
          cfeiId={id}
          edit={!!summary.review_summary_comment}
        />}
      </PaddedContent>);
  }


  render() {
    const { loading } = this.props;
    return (
      <HeaderList
        loading={loading}
        header={<Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>}
      >
        {this.content()}
      </HeaderList>
    );
  }
}

ReviewSummary.propTypes = {
  id: PropTypes.string,
  summary: PropTypes.object,
  isFocalPoint: PropTypes.bool,
  isCreator: PropTypes.bool,
  isAdvEd: PropTypes.bool,
  isBasEd: PropTypes.bool,
  isMFT: PropTypes.bool,
  isPAM: PropTypes.bool,
  hasAddSummaryPermission: PropTypes.bool,
  loading: PropTypes.bool,
  deadlinePassed: PropTypes.bool,
  isSend: PropTypes.bool,
  getReviewSummary: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  loading: state.cfeiReviewSummary.status.loading,
  summary: selectCfeiReviewSummary(state, ownProps.id),
  hasAddSummaryPermission: checkPermission(AGENCY_PERMISSIONS.CFEI_ADD_REVIEW_SUMMARY, state),
  isCreator: isUserACreator(state, ownProps.id),
  isFocalPoint: isUserAFocalPoint(state, ownProps.id),
  isAdvEd: isRoleOffice(AGENCY_ROLES.EDITOR_ADVANCED, state),
  isMFT: isRoleOffice(AGENCY_ROLES.MFT_USER, state),
  isPAM: isRoleOffice(AGENCY_ROLES.PAM_USER, state),
  isBasEd: isRoleOffice(AGENCY_ROLES.EDITOR_BASIC, state),
  deadlinePassed: isCfeiDeadlinePassed(state, ownProps.id),
  isSend: isSendForDecision(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getReviewSummary: () => dispatch(loadReviewSummary(ownProps.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewSummary);
