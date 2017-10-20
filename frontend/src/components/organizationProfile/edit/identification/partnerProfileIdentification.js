import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PropTypes from 'prop-types';
import PartnerProfileIdentificationBasicInfo from './partnerProfileIdentificationBasicInfo';
import PartnerProfileIdentificationRegistration from './partnerProfileIdentificationRegistration';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';

const STEPS = readOnly =>
  [
    {
      component: <PartnerProfileIdentificationBasicInfo />,
      label: 'Basic Information',
      name: 'basic',
    },
    {
      component: <PartnerProfileIdentificationRegistration readOnly={readOnly} />,
      label: 'Registration of Organization',
      name: 'registration',
    },
  ];


class PartnerProfileIdentification extends Component {
  constructor(props) {
    super(props);

    this.onNextClick = this.onNextClick.bind(this);
  }

  onNextClick(formValues) {
    const { initialValues, updateTab, partnerId, changeTab, loadPartnerProfileDetails } = this.props;

    const identification = flatten(formValues.identification);
    const initIndetification = flatten(initialValues.identification);

    return updateTab(partnerId, 'identification', changedValues(initIndetification, identification))
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

    return (
      <PartnerProfileStepperContainer
        name="identification"
        onSubmit={this.onNextClick}
        onNextClick={this.onNextClick}
        steps={STEPS(readOnly)}
        readOnly={readOnly}
      />);
  }
}

PartnerProfileIdentification.propTypes = {
  readOnly: PropTypes.bool,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  loadPartnerProfileDetails: PropTypes.func,
  initialValues: PropTypes.object,
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

const connectedPartnerProfileIdentification = connect(mapState, mapDispatch)(PartnerProfileIdentification);

export default withRouter(connectedPartnerProfileIdentification);

