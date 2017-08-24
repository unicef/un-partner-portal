import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Icon from 'material-ui/Icon';
import ReportProblemIcon from 'material-ui-icons/ReportProblem';
import {
  Step,
  StepContent,
  StepLabel,
} from '../customStepper';

const PartnerProfileStep = (props) => {
  const { item, incompleteSteps, index, ...other } = props;
  const warn = incompleteSteps.includes(item.name);
  return (
    <Step {...other}>
      <StepLabel
        icon={warn ? <Icon color="error"><ReportProblemIcon /></Icon> : index + 1}
        orientation="vertical"
        error={warn}
      >
        {item.label}
      </StepLabel>
      <StepContent>
        {item.component}
      </StepContent>
    </Step>
  );
};

PartnerProfileStep.propTypes = {
  incompleteSteps: PropTypes.array,
  item: PropTypes.objectOf({
    label: PropTypes.string,
    component: PropTypes.element,
  }),
  index: PropTypes.number,
};

const mapState = state => ({
  incompleteSteps: state.partnerProfileEdit.incompleteSteps,
});

export default connect(
  mapState,
)(PartnerProfileStep);
