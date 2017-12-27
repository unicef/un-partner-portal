import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileProjectImplementationManagement from './partnerProfileProjectImplementationManagement';
import PartnerProfileProjectImplementationFinancialControls from './partnerProfileProjectImplementationFinancialControls';
import PartnerProfileProjectImplementationInternalControls from './partnerProfileProjectImplementationInternalControls';
import PartnerProfileProjectImplementationBankingInfo from './partnerProfileProjectImplementationBankingInfo';
import PartnerProfileProjectImplementationAudit from './partnerProfileProjectImplementationAudit';
import PartnerProfileProjectImplementationReporting from './partnerProfileProjectImplementationReporting';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';
import { emptyMsg } from '../partnerProfileEdit';

const STEPS = readOnly => [
  {
    component: <PartnerProfileProjectImplementationManagement readOnly={readOnly} />,
    label: 'Programme Management',
    name: 'program_management',
  },
  {
    component: <PartnerProfileProjectImplementationFinancialControls readOnly={readOnly} />,
    label: 'Financial Controls',
    name: 'financial_controls',
  },
  {
    component: <PartnerProfileProjectImplementationInternalControls readOnly={readOnly} />,
    label: 'Internal Controls',
    name: 'internal_control',
  },
  {
    component: <PartnerProfileProjectImplementationBankingInfo readOnly={readOnly} />,
    label: 'Banking Information',
    name: 'banking_information',
  },
  {
    component: <PartnerProfileProjectImplementationAudit readOnly={readOnly} />,
    label: 'Audit & Assessments',
    name: 'audit',
  },
  {
    component: <PartnerProfileProjectImplementationReporting readOnly={readOnly} />,
    label: 'Reporting',
    name: 'report',
  },
];


class PartnerProfileProjectImplementation extends Component {
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

    const projectImplementation = flatten(formValues.project_impl);
    const initprojectImplementation = flatten(initialValues.project_impl);
    let changedItems = changedValues(initprojectImplementation, projectImplementation);

    if (changedItems.audit_reports) {
      changedItems = R.map((item) => {
        if (!R.is(Number, item.most_recent_audit_report)) {
          return R.dissoc('most_recent_audit_report', item);
        }
        return item;
      }, changedValues(initprojectImplementation, projectImplementation).audit_reports);
    }

    let patchValues = R.assoc('audit_reports', changedItems, changedValues(initprojectImplementation, projectImplementation));

    if (R.isEmpty(patchValues.audit_reports)) {
      patchValues = R.dissoc('audit_reports', patchValues);
    }

    if (!R.isEmpty(patchValues)) {
      return updateTab(partnerId, 'project-implementation', patchValues)
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
        name="project_impl"
        readOnly={readOnly}
        handleNext={this.handleNext}
        handleExit={this.handleExit}
        onSubmit={this.handleSubmit}
        steps={STEPS(readOnly)}
      />
    );
  }
}

PartnerProfileProjectImplementation.propTypes = {
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

const connectedPartnerProfileProjectImplementation =
  connect(mapState, mapDispatch)(PartnerProfileProjectImplementation);

export default withRouter(connectedPartnerProfileProjectImplementation);

