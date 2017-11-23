import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectCfeiDetails,
  isUserAFocalPoint,
  isUserAReviewer,
} from '../../../../../store';
import {
  loadApplication,
} from '../../../../../reducers/applicationDetails';
import { loadApplicationReviews } from '../../../../../reducers/applicationReviews';
import {
  loadCfei,
} from '../../../../../reducers/cfeiDetails';
import {
  loadPartnerDetails,
} from '../../../../../reducers/partnerProfileDetails';

class ApplicationSummaryHeader extends Component {
  componentWillMount() {
    const {
      getApplication,
      cfeiDetailsExists,
      getCfeiDetails,
      getPartnerDetails,
      shouldGetReviews,
      downloadReviews,
      user,
    } = this.props;
    getApplication().then((application) => {
      if (application) {
        if (!cfeiDetailsExists(application.eoi)) {
          getCfeiDetails(application.eoi).then((cfei) => {
            const { focal_points, reviewers } = cfei;
            if (focal_points.includes(user) || reviewers.includes(user)) downloadReviews();
          });
        } else if (shouldGetReviews(application.eoi)) downloadReviews();
        getPartnerDetails(application.partner.id);
      }
    });
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

ApplicationSummaryHeader.propTypes = {
  cfeiDetailsExists: PropTypes.bool,
  getApplication: PropTypes.func,
  getCfeiDetails: PropTypes.func,
  getPartnerDetails: PropTypes.func,
  shouldGetReviews: PropTypes.func,
  downloadReviews: PropTypes.func,
  user: PropTypes.number,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  cfeiDetailsExists: cfeiId => !!selectCfeiDetails(state, cfeiId),
  shouldGetReviews: eoi => isUserAFocalPoint(state, eoi) || isUserAReviewer(state, eoi),
  user: state.session.userId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getApplication: () => dispatch(loadApplication(ownProps.params.applicationId)),
  getCfeiDetails: eoi => dispatch(loadCfei(eoi)),
  getPartnerDetails: partner => dispatch(loadPartnerDetails(partner)),
  downloadReviews: () => dispatch(loadApplicationReviews(ownProps.params.applicationId)),
});

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
