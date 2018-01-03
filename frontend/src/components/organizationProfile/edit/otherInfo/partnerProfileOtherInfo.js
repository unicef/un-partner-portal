import R from 'ramda';
import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileOtherInfoContent from './partnerProfileOtherInfoContent';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';
import { emptyMsg } from '../partnerProfileEdit';

const STEPS = readOnly => [
  {
    component: <PartnerProfileOtherInfoContent readOnly={readOnly} />,
    label: 'Other Informations',
    name: 'other_info',
  },
];

class PartnerProfileOtherInfo extends Component {
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

    const otherInfo = flatten(formValues.other_info);
    const initOtherInfo = flatten(initialValues.other_info);

    const patchValues = changedValues(initOtherInfo, otherInfo);

    if (!R.isEmpty(patchValues)) {
      return updateTab(partnerId, 'other-info', patchValues)
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

    return (
      <PartnerProfileStepperContainer
        name="other_info"
        steps={STEPS(readOnly)}
        readOnly={readOnly}
        handleNext={this.handleNext}
        handleExit={this.handleExit}
        onSubmit={this.handleSubmit}
        last
        singleSection
      />
    );
  }
}

PartnerProfileOtherInfo.propTypes = {
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

const connectedPartnerProfileOtherInfo = connect(mapState, mapDispatch)(PartnerProfileOtherInfo);

export default withRouter(connectedPartnerProfileOtherInfo);
