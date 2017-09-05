import React from 'react';

import TextFieldForm from '../../forms/textFieldForm';
import SelectForm from '../../forms/selectForm';
import DatePickerForm from '../../forms/datePickerForm';
import PolarRadio from '../../forms/fields/PolarRadio';


const FOCAL = [
  {
    value: 1,
    label: 'Main',
  },
  {
    value: 2,
    label: 'Second',
  },
];

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

export const TitleField = () => (<TextFieldForm
  label="Project Title"
  fieldName="title"
  placeholder="Enter Project Title"
  value="brick"
/>);

export const FocalPoint = () => (<SelectForm
  label="Project/Programme Focal Point(s)"
  fieldName="focal_point"
  placeholder="Select the name of the Focal Point"
  values={FOCAL}
/>);

export const Population = () => (<SelectForm
  label="Intended populations of concern (only for UNHCR)"
  fieldName="population"
  placeholder="Select population"
  values={[]}
  optional
/>);

export const Background = () => (<TextFieldForm
  label="Brief background of the project"
  fieldName="description"
  multiline
  textFieldProps={{
    multiline: true,
    inputProps: {
      maxLength: '200',
    },
  }}
/>);

export const OtherInfo = () => (<TextFieldForm
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
/>);

export const StartDate = () => (<DatePickerForm
  label="Estimated Start Date"
  fieldName="start_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
/>);

export const EndDate = () => (<DatePickerForm
  label="Estimated End Date"
  fieldName="end_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
/>);

export const DeadlineDate = () => (<DatePickerForm
  label="Application Deadline"
  fieldName="deadline_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
/>);

export const NotifyDate = () => (<DatePickerForm
  label="Notification of Result"
  fieldName="notif_results_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: new Date(),
  }}
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
  fieldName="partners"
  label="Partners"
  values={PARTNERS}
  selectFieldProps={{
    multiple: true,
  }}

/>);
