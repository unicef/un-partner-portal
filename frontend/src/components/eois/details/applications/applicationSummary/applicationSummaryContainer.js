import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectPartnerName,
  selectCfeiDetails,
} from '../../../../../store';
import { loadApplication, updateApplicationPartnerName } from '../../../../../reducers/applicationDetails';
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
        if (!cfeiDetailsExists(application.eoi)) getCfeiDetails(application.eoi);
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
  children: PropTypes.node,
};

const mapStateToProps = state => ({
  partnerNameExists: name => !!selectPartnerName(state, name),
  cfeiDetailsExists: cfeiId => !!selectCfeiDetails(state, cfeiId),
  getPartnerNameFromState: id => selectPartnerName(state, id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  getPartnerNames: () => dispatch(loadPartnerNames()),
  getApplication: () => dispatch(loadApplication(ownProps.params.applicationId)),
  getCfeiDetails: eoi => dispatch(loadCfei(eoi)),
  getPartnerDetails: partner => dispatch(loadPartnerDetails(partner)),
  savePartnerName: (name, id) => dispatch(updateApplicationPartnerName(name, id)),
});

const containerApplicationSummaryHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationSummaryHeader);

export default containerApplicationSummaryHeader;
