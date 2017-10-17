import React from 'react';

import TextFieldForm from '../../textFieldForm';
import SelectForm from '../../selectForm';
import DatePickerForm from '../../datePickerForm';
import PolarRadio from '../../fields/PolarRadio';
import AgencyMembersField from './agencyMembersFields/agencyMembersField';

const COUNTRIES = [
  {
    value: 'GB',
    label: 'England',
  },
  {
    value: 'KE',
    label: 'Kenya',
  },
];

const PARTNERS = [
  {
    value: 1,
    label: 'Partner1',
  },
  {
    value: 2,
    label: 'Partner2',
  },
  {
    value: 3,
    label: 'Partner3',
  },
];

export const TitleField = props => (<TextFieldForm
  label="Project Title"
  fieldName="title"
  placeholder="Enter Project Title"
  {...props}
/>);

export const Background = props => (<TextFieldForm
  label="Brief background of the project"
  fieldName="description"
  multiline
  textFieldProps={{
    multiline: true,
    inputProps: {
      maxLength: '200',
    },
  }}
  {...props}
/>);

export const OtherInfo = props => (<TextFieldForm
  label="Other information (optional)"
  fieldName="other_information"
  multiline
  textFieldProps={{
    multiline: true,
    inputProps: {
      maxLength: '200',
    },
  }}
  optional
  {...props}
/>);

export const StartDate = props => (<DatePickerForm
  label="Estimated Start Date"
  fieldName="start_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
  {...props}
/>);

export const EndDate = props => (<DatePickerForm
  label="Estimated End Date"
  fieldName="end_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
  {...props}
/>);

export const DeadlineDate = props => (<DatePickerForm
  label="Application Deadline"
  fieldName="deadline_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
  {...props}
/>);

export const NotifyDate = props => (<DatePickerForm
  label="Notification of Result"
  fieldName="notif_results_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
  {...props}
/>);

export const Weighting = () => (<PolarRadio
  label="Is weighting relevant for this project?"
  fieldName="has_weighting"
/>);

export const ProjectCountries = () => (<SelectForm
  fieldName="countries"
  label="Country"
  values={COUNTRIES}
/>);

export const ProjectPartners = () => (<SelectForm
  fieldName="invited_partners"
  label="Partners"
  values={PARTNERS}
  selectFieldProps={{
    multiple: true,
  }}
/>);

export const FocalPoint = props => (<AgencyMembersField
  label="Project/Programme Focal Point(s)"
  fieldName="focal_points"
  placeholder="Select the name of the Focal Point"
  {...props}
/>);

export const Reviewers = () => (<AgencyMembersField
  label="Select users"
  fieldName="reviewers"
/>);
