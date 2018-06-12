
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';

import ProjectDetails from '../newCfei/ProjectDetails';
import PartnersForm from '../../../forms/fields/projectFields/partnersField/partnersFieldArrayEdit';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  selectPartners: 'Select Partner',
  selectionCriteria: 'Selection Criteria',
};


const EditDirectForm = (props) => {
  const {
    handleSubmit,
    start_date,
    cfeiDetails,
    partner } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          // formName="cfeiDetails"
          cfeiDetails={cfeiDetails}
        >
          <fields.StartDate />
          <fields.EndDate minDate={start_date} />
        </ProjectDetails>
        <Typography type="headline">
          {messages.selectPartners}
        </Typography>
        <PartnersForm partner={partner} />
      </GridColumn>
    </form >
  );
};

EditDirectForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  start_date: PropTypes.string,
  partners: PropTypes.array,
};

const selector = formValueSelector('newDirectCfei');

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const startDate = selector(state, 'start_date');
  console.log(cfei);
  return {
    start_date: startDate,
    cfeiDetails: cfei,
    partner: cfei.direct_selected_partners,
    initialValues: {
      cfeiDetails: cfei,
      start_date: cfei.start_date,
    },
  };
};


const connectedEditDirectForm = connect(
  mapStateToProps,
)(EditDirectForm);

export default reduxForm({
  form: 'editDirectCfei',
})(connectedEditDirectForm);

