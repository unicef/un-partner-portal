import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { browserHistory as history } from 'react-router';
import SectorForm from '../../../forms/fields/projectFields/sectorField/sectorFieldArray';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import HeaderList from '../../../common/list/headerList';
import TextField from '../../../forms/textFieldForm';
import ProjectPartners from '../../../forms/fields/projectFields/partnersField/ProjectPartners';
import PaddedContent from '../../../common/paddedContent';
import {
  Attachments,
  TitleField,
  FocalPoint,
  OtherInfo,
  Background,
  Goal,
  StartDate,
  EndDate,
  DeadlineDate,
  ClarificationRequestDeadlineDate,
  NotifyDate,
} from '../../../forms/fields/projectFields/commonFields';
import LocationFieldReadOnlyArray from '../../../forms/fields/projectFields/locationField/locationFieldReadOnlyArray';
import SpreadContent from '../../../common/spreadContent';
import { PROJECT_TYPES, ROLES } from '../../../../helpers/constants';
import OrganizationTypes from '../../../forms/fields/projectFields/organizationType';
import Agencies from '../../../forms/fields/projectFields/agencies';

const messages = {
  title: 'Project Details',
  labels: {
    id: 'CFEI ID:',
    dsrId: 'DSR ID:',
    issued: 'Issued by',
    goal: 'Expected Results',
    agency: 'Agency',
    partner: 'Organization\'s Legal Name',
    type: 'Type of Organization',
    viewProfile: 'view partner\'s profile',
  },
};

const Fields = ({ type, role, partnerId, displayGoal, formName }) => {
  if (type === PROJECT_TYPES.UNSOLICITED) {
    return (<PaddedContent>
      <GridColumn >
        {role === ROLES.AGENCY &&
          <GridRow columns={2} >
            <ProjectPartners
              fieldName="partner_name"
              label={messages.labels.partner}
              readOnly
            />
            <OrganizationTypes
              fieldName="display_type"
              label={messages.labels.type}
              readOnly
            />
          </GridRow>}
        <TitleField readOnly />
        {role === ROLES.PARTNER && <Agencies
          fieldName="agency"
          readOnly
        />}
        <LocationFieldReadOnlyArray formName={formName}  />
        <SectorForm readOnly />
        {role === ROLES.AGENCY && <Grid container justify="flex-end">
          <Grid item>
            <Button
              onClick={() => history.push(`/partner/${partnerId}/details`)}
              color="accent"
            >
              {messages.labels.viewProfile}
            </Button>
          </Grid>
        </Grid>}
      </GridColumn>
    </PaddedContent>);
  }
  return (<PaddedContent>
    <GridColumn >
      <TitleField readOnly />
      <FocalPoint readOnly />
      <LocationFieldReadOnlyArray formName={formName} />
      <SectorForm readOnly />
      <Agencies
        fieldName="agency"
        label={messages.labels.issued}
        readOnly
      />
      <Background readOnly />
      {displayGoal && <Goal readOnly />}
      <OtherInfo readOnly />
      {type === PROJECT_TYPES.OPEN && <GridRow columns={3} >
        <ClarificationRequestDeadlineDate readOnly />
        <DeadlineDate readOnly />
        <NotifyDate readOnly />
      </GridRow>}
      <GridRow columns={3} >
        <StartDate readOnly />
        <EndDate readOnly />
      </GridRow>
      {type === PROJECT_TYPES.OPEN &&
        <Attachments readOnly />}
    </GridColumn>
  </PaddedContent>);
};

Fields.propTypes = {
  type: PropTypes.string,
  role: PropTypes.string,
  partner: PropTypes.string,
  formName: PropTypes.string,
  partnerId: PropTypes.number,
  displayGoal: PropTypes.bool,
};


const title = type => () => (
  <SpreadContent>
    <Typography type="headline" >{messages.title}</Typography>
    {type !== PROJECT_TYPES.UNSOLICITED &&
    <TextField
      fieldName="displayID"
      label={(type === PROJECT_TYPES.OPEN || type === PROJECT_TYPES.PINNED) ? messages.labels.id : messages.labels.dsrId}
      readOnly
    />}
  </SpreadContent>
);

const ProjectDetails = ({ type, role, partner, partnerId, displayGoal, formName }) => (
  <HeaderList
    header={title(type)}
  >
    <Fields formName={formName} type={type} role={role} partner={partner} partnerId={partnerId} displayGoal={displayGoal} />
  </HeaderList>
);

ProjectDetails.propTypes = {
  type: PropTypes.string,
  role: PropTypes.string,
  partner: PropTypes.string,
  partnerId: PropTypes.number,
  displayGoal: PropTypes.bool,
};

export default ProjectDetails;
