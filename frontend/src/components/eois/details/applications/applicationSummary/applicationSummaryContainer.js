import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectPartnerName,
  selectCfeiDetails,
  isUserAFocalPoint,
  isUserAReviewer,
} from '../../../../../store';
import {
  loadApplication,
  updateApplicationPartnerName,
} from '../../../../../reducers/applicationDetails';
import { loadApplicationReviews } from '../../../../../reducers/applicationReviews';
import { loadPartnerNames } from '../../../../../reducers/partnerNames';
import {
  loadCfei,
} from '../../../../../reducers/cfeiDetails';
import {
  loadPartnerDetails,
} from '../../../../../reducers/partnerProfileDetails';

class ApplicationSummaryHeader extends Component {
  componentWillMount() {
    const {
      getPartnerNames,
      getApplication,
      partnerNameExists,
      cfeiDetailsExists,
      savePartnerName,
      getCfeiDetails,
      getPartnerDetails,
      getPartnerNameFromState,
      shouldGetReviews,
      downloadReviews,
      user,
    } = this.props;
    getApplication().then((application) => {
      if (application) {
        if (!partnerNameExists(application.partner)) {
          getPartnerNames().then((partnerNames) => {
            savePartnerName(partnerNames.find(
              name => name.id === application.partner), application.id);
          });
        } else {
          savePartnerName(getPartnerNameFromState(application.partner), application.id);
        }
        if (!cfeiDetailsExists(application.eoi)) {
          getCfeiDetails(application.eoi).then((cfei) => {
            const { focal_points, reviewers } = cfei;
            if (focal_points.includes(user) || reviewers.includes(user)) downloadReviews();
          });
        } else if (shouldGetReviews(application.eoi)) downloadReviews();
        getPartnerDetails(application.partner);
      }
    });
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

ApplicationSummaryHeader.propTypes = {
  partnerNameExists: PropTypes.bool,
  cfeiDetailsExists: PropTypes.bool,
  getPartnerNameFromState: PropTypes.func,
  getPartnerNames: PropTypes.func,
  getApplication: PropTypes.func,
  getCfeiDetails: PropTypes.func,
  getPartnerDetails: PropTypes.func,
  savePartnerName: PropTypes.func,
  shouldGetReviews: PropTypes.func,
  downloadReviews: PropTypes.func,
  user: PropTypes.number,
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  partnerNameExists: name => !!selectPartnerName(state, name),
  cfeiDetailsExists: cfeiId => !!selectCfeiDetails(state, cfeiId),
  getPartnerNameFromState: id => selectPartnerName(state, id),
  shouldGetReviews: eoi => isUserAFocalPoint(state, eoi) || isUserAReviewer(state, eoi),
  user: state.session.userId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getPartnerNames: () => dispatch(loadPartnerNames()),
  getApplication: () => dispatch(loadApplication(ownProps.params.applicationId)),
  getCfeiDetails: eoi => dispatch(loadCfei(eoi)),
  getPartnerDetails: partner => dispatch(loadPartnerDetails(partner)),
  savePartnerName: (name, id) => dispatch(updateApplicationPartnerName(name, id)),
  downloadReviews: () => dispatch(loadApplicationReviews(ownProps.params.applicationId)),
});

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
