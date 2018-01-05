import R from 'ramda';
import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
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
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';
import { emptyMsg } from '../partnerProfileEdit';

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
    infoText: 'Populations of Concern: is composed of various groups of people including ' +
    'refugees, asylum-seekers, internally displaced persons (IDPs) protected/assisted by ' +
    'UNHCR, stateless persons and returnees (returned refugees and IDPs).',
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

    this.state = {
      actionOnSubmit: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  onSubmit() {
    const { partnerId, tabs, params: { type } } = this.props;

    if (this.state.actionOnSubmit === 'next') {
      const index = tabs.findIndex(itab => itab.path === type);
      history.push({
        pathname: `/profile/${partnerId}/edit/${tabs[index + 1].path}`,
      });
    } else if (this.state.actionOnSubmit === 'exit') {
      history.push(`/profile/${partnerId}/overview`);
    }
  }

  handleNext() {
    this.setState({ actionOnSubmit: 'next' });
  }

  handleExit() {
    this.setState({ actionOnSubmit: 'exit' });
  }

  handleSubmit(formValues) {
    const { initialValues, updateTab, partnerId, loadPartnerProfileDetails } = this.props;

    const mandateMission = flatten(formValues.mandate_mission);
    const initMandateMission = flatten(initialValues.mandate_mission);

    const convertExperiences = mandateMission.specializations
      ? R.flatten(R.map(item => (item.areas ?
        R.map(area => R.assoc('years', item.years,
          R.objOf('specialization_id', area)),
        item.areas) : []), mandateMission.specializations))
      : [];

    const changed = changedValues(initMandateMission, mandateMission);

    let patchValues = R.assoc('experiences', R.filter(item => !R.isNil(item.specialization_id), convertExperiences), changed);

    if (R.isEmpty(patchValues.experiences)) {
      patchValues = R.dissoc('experiences', patchValues);
    }

    if (!R.isEmpty(patchValues)) {
      return updateTab(partnerId, 'mandate-mission', patchValues)
        .then(() => loadPartnerProfileDetails(partnerId).then(() => this.onSubmit()))
        .catch((error) => {
          const errorMsg = error.response.data.non_field_errors || 'Error while saving sections. Please try again.';

          throw new SubmissionError({
            ...error.response.data,
            _error: errorMsg,
          });
        });
    }

    throw new SubmissionError({
      _error: emptyMsg,
    });
  }

  render() {
    const { readOnly } = this.props;

    return (<PartnerProfileStepperContainer
      handleNext={this.handleNext}
      handleExit={this.handleExit}
      onSubmit={this.handleSubmit}
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
  params: PropTypes.object,
  tabs: PropTypes.array,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  tabs: state.partnerProfileDetailsNav.tabs,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileMandate = connect(mapState, mapDispatch)(PartnerProfileMandate);

export default withRouter(connectedPartnerProfileMandate);
