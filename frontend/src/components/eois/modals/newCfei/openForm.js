import React from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import ProjectDetails from './ProjectDetails';
import SelectionField from '../../../forms/fields/projectFields/selectionCriteria/selectionFieldArray';

const messages = {
  selectionCriteria: 'Selection Criteria',
};

const OpenForm = (props) => {
  const { handleSubmit, start_date, deadline_date,
    notif_results_date, clarification_request_deadline_date, form } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="newOpenCfei"
        >
          <fields.ClarificationRequestDeadlineDate />
          <fields.DeadlineDate minDate={clarification_request_deadline_date} />
          <fields.NotifyDate minDate={deadline_date} />
          <fields.StartDate minDate={notif_results_date} />
          <fields.EndDate minDate={start_date} />
        </ProjectDetails>
        <Typography type="headline">
          {messages.selectionCriteria}
        </Typography>
        <fields.Weighting />
        <SelectionField form={form} />
      </GridColumn>
    </form >
  );
};

OpenForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  deadline_date: PropTypes.string,
  notif_results_date: PropTypes.string,
  clarification_request_deadline_date: PropTypes.string,
  start_date: PropTypes.string,
  form: PropTypes.string,
};

const selector = formValueSelector('newOpenCfei');

const connectedOpenForm = connect(
  state => selector(state, 'start_date', 'end_date', 'deadline_date', 'notif_results_date'),
)(OpenForm);

export default reduxForm({
  form: 'newOpenCfei',
})(connectedOpenForm);
