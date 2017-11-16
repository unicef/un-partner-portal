
import React from 'react';
import { reduxForm } from 'redux-form';
import { reduxForm, formValueSelector } from 'redux-form';

import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';

import ProjectDetails from './ProjectDetails';
import PartnersForm from '../../../forms/fields/projectFields/partnersField/partnersFieldArray';

const messages = {

  selectPartners: 'Select Partners',
  selectionCriteria: 'Selection Criteria',
};


const DirectForm = (props) => {
  const { handleSubmit, start_date } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          formName="newDirectCfei"
          dateFields={[
            <fields.StartDate />,
             <fields.EndDate minDate={start_date} />,
          ]}
        />
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
  getPartnerNames: PropTypes.func,
  start_date: PropTypes.string,

};
const selector = formValueSelector('newDirectCfei');

const mapStateToProps = state => ({
  start_date: selector(state, 'start_date'),
});


const mapDispatchToProps = dispatch => ({
  getPartnerNames: () => dispatch(loadPartnerNames()),
});

const connectedDirectForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DirectForm);

export default reduxForm({
  form: 'newDirectCfei',
})(DirectForm);

