import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import { ProjectCountries, ProjectPartners } from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';


const CallPartnersForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectCountries />
        <ProjectPartners />
      </GridColumn>
    </form >
  );
};

CallPartnersForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,

};

export default reduxForm({
  form: 'callPartners',
})(CallPartnersForm);
