
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { pluck } from 'ramda';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';

import ProjectDetails from '../editDsr/ProjectDetails';
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
          cfeiDetails={cfeiDetails}
          formName="editDsr"
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

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const startDate = cfei.start_date;
  const displayPopulation = state.session.agencyName === 'UNHCR';
  const focalPoints = pluck('name', cfei.focal_points_detail);
  const cfeiLocations = cfei.cfei_locations;
  console.log(cfei);
  return {
    start_date: startDate,
    cfeiDetails: cfei,
    partner: cfei.direct_selected_partners,
    initialValues: {
      // cfeiDetails: cfei,
      title: cfei.title,

      specializations: cfei.specializations,
      focal_points: focalPoints,
      description: cfei.description,
      goal: cfei.goal,
      start_date: cfei.start_date,
      end_date: cfei.end_date,
      other_information: cfei.other_information,
      countries: cfei.cfei_locations,
    },
  };
};

const formEditDsr = reduxForm({
  form: 'editDsr',
})(EditDirectForm);

export default connect(
  mapStateToProps,
)(formEditDsr);

