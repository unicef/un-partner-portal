import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileMandateBackground from './partnerProfileMandateBackground';
import PartnerProfileMandateGovernance from './partnerProfileMandateGovernance';
import PartnerProfileMandateEthics from './partnerProfileMandateEthics';
import PartnerProfileMandateExperience from './partnerProfileMandateExperience';
import PartnerProfileMandatePopulation from './partnerProfileMandatePopulation';
import PartnerProfileMandateCountryPresence from './partnerProfileMandateCountryPresence';
import PartnerProfileMandateSecurity from './partnerProfileMandateSecurity';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';

const STEPS = readOnly => [
  {
    component: <PartnerProfileMandateBackground readOnly={readOnly} />,
    label: 'Background',
    name: 'background',
  },
  {
    component: <PartnerProfileMandateGovernance readOnly={readOnly} />,
    label: 'Governance',
    name: 'governance',
  },
  {
    component: <PartnerProfileMandateEthics readOnly={readOnly} />,
    label: 'Ethics',
    name: 'ethics',
  },
  {
    component: <PartnerProfileMandateExperience readOnly={readOnly} />,
    label: 'Experience',
    name: 'experience',
  },
  {
    component: <PartnerProfileMandatePopulation readOnly={readOnly} />,
    label: 'Population of Concern',
    name: 'populations_of_concern',
  },
  {
    component: <PartnerProfileMandateCountryPresence readOnly={readOnly} />,
    label: 'Country Presence',
    name: 'country_presence',
  },
  {
    component: <PartnerProfileMandateSecurity readOnly={readOnly} />,
    label: 'Security',
    name: 'security',
  },
];

class PartnerProfileMandate extends Component {
  constructor(props) {
    super(props);

    this.onNextClick = this.onNextClick.bind(this);
  }

  onNextClick(formValues) {
    const { initialValues, updateTab, partnerId,
      changeTab, loadPartnerProfileDetails } = this.props;

    const mandateMission = flatten(formValues.mandate_mission);
    const initMandateMission = flatten(initialValues.mandate_mission);

    return updateTab(partnerId, 'mandate-mission', changedValues(initMandateMission, mandateMission))
      .then(() => loadPartnerProfileDetails(partnerId).then(() => changeTab()))
      .catch((error) => {
        const errorMsg = error.response.data.non_field_errors || 'Error while saving sections. Please try again.';

        throw new SubmissionError({
          ...error.response.data,
          _error: errorMsg,
        });
      });
  }

  render() {
    const { readOnly } = this.props;

    return (<PartnerProfileStepperContainer
      onSubmit={this.onNextClick}
      onNextClick={this.onNextClick}
      name="mandate_mission"
      readOnly={readOnly}
      steps={STEPS(readOnly)}
    />
    );
  }
}

PartnerProfileMandate.propTypes = {
  readOnly: PropTypes.bool,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  initialValues: PropTypes.object,
  loadPartnerProfileDetails: PropTypes.func,
  changeTab: PropTypes.func,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  changeTab: () => dispatch(changeTabToNext()),
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileMandate = connect(mapState, mapDispatch)(PartnerProfileMandate);

export default withRouter(connectedPartnerProfileMandate);
