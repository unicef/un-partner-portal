import R from 'ramda';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getFormInitialValues, startSubmit } from 'redux-form';
import PropTypes from 'prop-types';
import PartnerProfileIdentificationBasicInfo from './partnerProfileIdentificationBasicInfo';
import PartnerProfileIdentificationRegistration from './partnerProfileIdentificationRegistration';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';

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
    const { initialValues, submitLoading, updateTab, partnerId } = this.props;

    const identification = flatten(formValues.identification);
    const initIndetification = flatten(initialValues.identification);

    const diffFields = R.mapObjIndexed((num, key, obj) => R.equals(identification[key], obj[key]), initIndetification);
    const filtered = R.keys(R.filter((item) => { if (!item) return !item; }, diffFields));
    const changedValues = R.mergeAll(R.map(item => R.objOf(item, identification[item]), filtered));

    submitLoading();
    updateTab(partnerId, 'identification', changedValues);
  }

  render() {
    const { readOnly } = this.props;

    return (
      <PartnerProfileStepperContainer
        name="identification"
        onSubmit={this.onNextClick}
        steps={STEPS(readOnly)}
        onNextClick={this.onNextClick}
        readOnly={readOnly}
      />);
  }
}

PartnerProfileIdentification.propTypes = {
  readOnly: PropTypes.bool,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  submitLoading: PropTypes.func,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  changeTab: () => dispatch(changeTabToNext()),
  submitLoading: () => dispatch(startSubmit('partnerProfile')),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
});

const connectedPartnerProfileIdentification = connect(mapState, mapDispatch)(PartnerProfileIdentification);

export default withRouter(connectedPartnerProfileIdentification);

