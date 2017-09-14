import React from 'react';
import Grid from 'material-ui/Grid';
import { FormSection } from 'redux-form';

import Typography from 'material-ui/Typography';

import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import HeaderList from '../../../common/list/headerList';
import TextField from '../../../forms/textFieldForm';
import PaddedContent from '../../../common/paddedContent';
import { TitleField,
  FocalPoint,
  OtherInfo,
  Background,
  StartDate,
  EndDate,
  DeadlineDate,
  NotifyDate } from '../../modals/commonFields';

const messages = {
  title: 'Project Details',
  labels: {
    id: 'CFEI ID:',
    issued: 'Issued by',
    goal: 'Goal, Objective, Expected Outcome and Results',
  },

};

const Fields = () => (
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
      <GridRow columns={2} >
        <DeadlineDate readOnly />
        <NotifyDate readOnly />
      </GridRow>
    </GridColumn>
  </PaddedContent>
);

const title = () => (
  <Grid container align="center" direction="row">
    <Grid item xs={10}>
      <Typography type="subheading" >{messages.title}</Typography>
    </Grid>
    <Grid item xs={2}>
      <TextField
        fieldName="id"
        label={messages.labels.id}
        readOnly
      />
    </Grid>
  </Grid>

);

const ProjectDetails = (props) => {
  return (
    <FormSection name="eoi">
      <HeaderList
        header={title}
        rows={[<Fields />]}
      />
    </FormSection>
  );
};

export default ProjectDetails;
