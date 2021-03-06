import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import * as fields from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import LocationForm from '../../../forms/fields/projectFields/locationField/locationFieldArray';
import CnFileSection from '../../details/submission/cnFileSection';
import FileForm from '../../../forms/fileForm';
import Agencies from '../../../forms/fields/projectFields/agencies';
import ProfileConfirmation from '../../../organizationProfile/common/profileConfirmation';

const messages = {
  cn: 'Concept Note',
  projectDetails: 'Project Details',
  cnLabel: 'Please ensure that you have used the concept note template provided by the UN agency to whom you are submitting this unsolicited concept note.',
};

const OpenForm = (props) => {
  const { handleSubmit, form, handleConfirmation } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <Typography type="headline">
          {messages.projectDetails}
        </Typography>
        <Agencies fieldName="agency" />
        <fields.TitleField />
        <LocationForm formName={form} />
        <SectorForm />
        <Typography type="headline">
          {messages.cn}
        </Typography>
        <CnFileSection
          showComponent
          component={<FileForm
            fieldName="cn"
          />}
          label={messages.cnLabel}
          displayHint={false}
        />
        <ProfileConfirmation onChange={handleConfirmation} />
      </GridColumn>
    </form >
  );
};

OpenForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.string,
  handleConfirmation: PropTypes.func,

};

export default reduxForm({
  form: 'newUnsolicitedCN',
  touchOnChange: true,
})(OpenForm);
