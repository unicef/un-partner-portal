
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';

import ProjectDetailsDsr from './ProjectDetailsDsr';
import PartnersForm from '../../../forms/fields/projectFields/partnersField/partnersFieldArray';

const messages = {
  selectPartners: 'Select Partner',
  selectionCriteria: 'Selection Criteria',
};


const DirectForm = (props) => {
  const { handleSubmit, start_date } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetailsDsr
          formName="newDirectCfei"
        >
          <fields.StartDate />
          <fields.EndDate minDate={start_date} />
        </ProjectDetailsDsr>
        <Typography type="headline">
          {messages.selectPartners}
        </Typography>
        <PartnersForm />
      </GridColumn>
    </form >
  );
};

DirectForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  start_date: PropTypes.string,

};
const selector = formValueSelector('newDirectCfei');

const mapStateToProps = state => ({
  start_date: selector(state, 'start_date'),
});


const connectedDirectForm = connect(
  mapStateToProps,
)(DirectForm);

export default reduxForm({
  form: 'newDirectCfei',
})(connectedDirectForm);

