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
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';

const STEPS = readOnly =>
  [
    {
      component: <PartnerProfileContactInfoAddress readOnly={readOnly} />,
      label: 'Mailing Address',
      name: 'address',
    },
    {
      component: <PartnerProfileContactInfoOfficials readOnly={readOnly} />,
      label: 'Authorized Officials',
      name: 'authorised_officials',
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
    const { partnerId, changeTab } = this.props;

    if (this.state.actionOnSubmit === 'next') {
      changeTab();
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

    const mailing = R.assoc('mailing_address', address, flatten(unflattenMailing));
    const initMailing = R.assoc('mailing_address', addressInit, flatten(unflattenMailingInit));

    return updateTab(partnerId, 'contact-information', changedValues(initMailing, mailing))
      .then(() => loadPartnerProfileDetails(partnerId).then(() => this.onSubmit()))
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

const connectedPartnerProfileContactInfo =
  connect(mapState, mapDispatch)(PartnerProfileContactInfo);

export default withRouter(connectedPartnerProfileContactInfo);
