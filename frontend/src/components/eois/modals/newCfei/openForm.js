import React from 'react';
import { reduxForm } from 'redux-form';
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
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="newOpenCfei"
          dateFields={[
            <fields.DeadlineDate />,
            <fields.NotifyDate />,
            <fields.StartDate />,
            <fields.EndDate />,
          ]}
        />
        <Typography type="headline">
          {messages.selectionCriteria}
        </Typography>
        <fields.Weighting />
        <SelectionField />
      </GridColumn>
    </form >
  );
};

OpenForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,

};

export default reduxForm({
  form: 'newOpenCfei',
})(OpenForm);
