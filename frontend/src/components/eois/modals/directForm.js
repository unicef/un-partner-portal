import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography';

import * as fields from './commonFields';
import GridColumn from '../../common/grid/gridColumn';

import ProjectDetails from './ProjectDetails';

const messages = {

  selectPartners: 'Select Partners',
  selectionCriteria: 'Selection Criteria',
};

const DirectForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="newDirectCfei"
          dateFields={[
            <fields.StartDate />,
            <fields.EndDate />,
          ]}
        />
        <Typography type="headline">
          {messages.selectPartners}
        </Typography>
      </GridColumn>
    </form >
  );
};

DirectForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,

};

export default reduxForm({
  form: 'newDirectCfei',
})(DirectForm);
