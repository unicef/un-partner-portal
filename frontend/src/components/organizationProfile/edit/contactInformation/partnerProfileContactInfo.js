import R from 'ramda';
import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileContactInfoConnectivity from './partnerProfileContactInfoConnectivity';
import PartnerProfileContactInfoAddress from './partnerProfileContactInfoAddress';
import PartnerProfileContactInfoOfficials from './partnerProfileContactInfoOfficials';
import PartnerProfileContactInfoLanguages from './partnerProfileContactInfoLanguages';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import PartnerProfileContactInfoHeadOrganization from './partnerProfileContactInfoHeadOrganization';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';
import { emptyMsg } from '../partnerProfileEdit';

const STEPS = readOnly =>
  [
    {
      component: <PartnerProfileContactInfoAddress readOnly={readOnly} />,
      label: 'Mailing Address',
      name: 'address',
    },
    {
      component: <PartnerProfileContactInfoOfficials readOnly={readOnly} />,
      label: 'Key Personnel',
      name: 'authorised_officials',
      infoText: 'Authorised officer: a member of the organization who has been formally ' +
      'empowered by that organization to conduct affairs on its behalf, and who has the ' +
      'authority to enter the organization into legal agreements with the UN and others. An ' +
      'organization may have one or more authorized officers.',
    },
    {
      component: <PartnerProfileContactInfoHeadOrganization readOnly={readOnly} />,
      label: 'Head of Organization',
      name: 'org_head',
    },
    {
      component: <PartnerProfileContactInfoConnectivity readOnly={readOnly} />,
      label: 'Connectivity',
      name: 'connectivity',
    },
    {
      component: <PartnerProfileContactInfoLanguages readOnly={readOnly} />,
      label: 'Working Languages',
      name: 'working_languages',
    },
  ];


class PartnerProfileContactInfo extends Component {
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

    const unflattenMailing = R.dissocPath('address', formValues.mailing);
    const unflattenMailingInit = R.dissocPath('address', initialValues.mailing);
    const address = formValues.mailing.address;
    const addressInit = initialValues.mailing.address;
    const orgHead = formValues.mailing.org_head;
    const orgHeadInit = initialValues.mailing.org_head;

    let values = R.assoc('mailing_address', address, flatten(unflattenMailing));
    let initValues = R.assoc('mailing_address', addressInit, flatten(unflattenMailingInit));

    values = R.assoc('org_head', orgHead, values);
    initValues = R.assoc('org_head', orgHeadInit, initValues);

    const patchValues = changedValues(initValues, values);

    if (!R.isEmpty(patchValues)) {
      return updateTab(partnerId, 'contact-information', patchValues)
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
      name="mailing"
      handleNext={this.handleNext}
      handleExit={this.handleExit}
      onSubmit={this.handleSubmit}
      readOnly={readOnly}
      steps={STEPS(readOnly)}
    />);
  }
}

PartnerProfileContactInfo.propTypes = {
  readOnly: PropTypes.bool,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  initialValues: PropTypes.object,
  loadPartnerProfileDetails: PropTypes.func,
  params: PropTypes.object,
  tabs: PropTypes.array,
};

const mapState = (state, ownProps) => ({
  tabs: state.partnerProfileDetailsNav.tabs,
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileContactInfo =
  connect(mapState, mapDispatch)(PartnerProfileContactInfo);

export default withRouter(connectedPartnerProfileContactInfo);
