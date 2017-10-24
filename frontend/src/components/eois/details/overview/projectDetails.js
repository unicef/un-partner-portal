import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import HeaderList from '../../../common/list/headerList';
import TextField from '../../../forms/textFieldForm';
import PaddedContent from '../../../common/paddedContent';
import {
  TitleField,
  FocalPoint,
  OtherInfo,
  Background,
  StartDate,
  EndDate,
  DeadlineDate,
  NotifyDate,
} from '../../../forms/fields/projectFields/commonFields';
import SpreadContent from '../../../common/spreadContent';
import { PROJECT_TYPES } from '../../../../helpers/constants';

const messages = {
  title: 'Project Details',
  labels: {
    id: 'CFEI ID:',
    issued: 'Issued by',
    goal: 'Goal, Objective, Expected Outcome and Results',
  },

};

const Fields = ({ type }) => (
  <PaddedContent>
    <GridColumn >
      <TitleField readOnly />
      <FocalPoint readOnly />
      <SectorForm readOnly />
      <TextField
        fieldName="agency"
        label={messages.labels.issued}
        readOnly
      />
      <Background readOnly />
      <TextField
        fieldName="goal"
        label={messages.labels.goal}
        readOnly
      />
      <OtherInfo readOnly />
      <GridRow columns={2} >
        <StartDate readOnly />
        <EndDate readOnly />
      </GridRow>
      {type === PROJECT_TYPES.OPEN && <GridRow columns={2} >
        <DeadlineDate readOnly />
        <NotifyDate readOnly />
      </GridRow>}
    </GridColumn>
  </PaddedContent>
);

Fields.propTypes = {
  type: PropTypes.string,
};


const title = () => (
  <SpreadContent>
    <Typography type="headline" >{messages.title}</Typography>
    <TextField
      fieldName="id"
      label={messages.labels.id}
      readOnly
    />
  </SpreadContent>
);

const ProjectDetails = ({ type }) => (
  <HeaderList
    header={title}
    rows={[<Fields type={type} />]}
  />
);

ProjectDetails.propTypes = {
  type: PropTypes.string,
};

export default ProjectDetails;
