
import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { pluck } from 'ramda';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';

import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';

import ProjectDetails from '../editDsr/ProjectDetails';
import PartnersForm from '../../../forms/fields/projectFields/partnersField/partnersFieldArray';
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
    partner,
    focalPointName, } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectDetails
          cfeiDetails={cfeiDetails}
          formName="editDsr"
          focalPoints={focalPointName}
        >
          <fields.StartDate />
          <fields.EndDate minDate={start_date} />
        </ProjectDetails>
        <Typography type="headline">
          {messages.selectPartners}
        </Typography>
        <PartnersForm partnername={partner} />
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
  focalPointName: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  const startDate = cfei.start_date;
  const cfeifocaldetail = cfei.focal_points_detail[0];
  const focalPoints = Number(cfeifocaldetail.id);
  const focalPointName = cfeifocaldetail.name;
  console.log('FOCAL POINT NAME IN DSR FORM', focalPointName);
  const partner = cfei.direct_selected_partners[0].partner_name;
  const applications = [];
  applications.push({
    partner: Number(cfei.direct_selected_partners[0].partner_id),
    ds_justification_select: cfei.direct_selected_partners[0].ds_justification_select,
    justification_reason: cfei.direct_selected_partners[0].justification_reason,
    ds_attachment: cfei.direct_selected_partners[0].ds_attachmnt,
  });
  console.log(cfei);
  return {
    start_date: startDate,
    cfeiDetails: cfei,
    partner,
    focalPointName,
    initialValues: {
      // cfeiDetails: cfei,
      title: cfei.title,
      applications,
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

