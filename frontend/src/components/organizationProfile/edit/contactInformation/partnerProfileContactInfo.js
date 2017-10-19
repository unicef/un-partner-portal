import React, { Component } from 'react';
import { withRouter } from 'react-router';
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

    this.onNextClick = this.onNextClick.bind(this);
  }


  onNextClick(formValues) {
    const { initialValues, updateTab, partnerId, changeTab } = this.props;

    const mailing = flatten(formValues.mailing);
    const initMailing = flatten(initialValues.mailing);
debugger
    return updateTab(partnerId, 'contact-information', changedValues(initMailing, mailing))
      .then(() => {
        changeTab();
      })
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
      onSubmit={this.onNextClick}
      onNextClick={this.onNextClick}
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
  changeTab: PropTypes.func,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  changeTab: () => dispatch(changeTabToNext()),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileContactInfo = connect(mapState, mapDispatch)(PartnerProfileContactInfo);

export default withRouter(connectedPartnerProfileContactInfo);
