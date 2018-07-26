import React from 'react';
import TextFieldForm from '../../textFieldForm';
import DatePickerForm from '../../datePickerForm';
import PolarRadio from '../../fields/PolarRadio';
import { endDate, startDate, notifResultsDate } from '../../../../helpers/validation';
import { formatDateForDatePicker } from '../../../../helpers/dates';
import AgencyReviewersField from './agencyMembersFields/agencyReviewersField';
import AgencyFocalPointsField from './agencyMembersFields/agencyFocalPointsField';

export const TitleField = props => (<TextFieldForm
  label="Project Title"
  fieldName="title"
  placeholder="Enter Project Title"
  {...props}
/>);

export const Background = props => (<TextFieldForm
  label="Project Background"
  fieldName="description"
  multiline
  textFieldProps={{
    multiline: true,
    InputProps: {
      inputProps: {
        maxLength: '5000',
      },
    },
  }}
  {...props}
/>);

export const Goal = props => (<TextFieldForm
  label="Expected Results"
  fieldName="goal"
  multiline
  textFieldProps={{
    multiline: true,
    InputProps: {
      inputProps: {
        maxLength: '5000',
      },
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
    InputProps: {
      inputProps: {
        maxLength: '5000',
      },
    },
  }}
  optional
  {...props}
/>);

export const StartDate = ({ minDate, ...props }) => (<DatePickerForm
  label="Estimated Start Date"
  fieldName="start_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: (minDate && minDate !== 'Invalid date') ? formatDateForDatePicker(minDate) : new Date(),
  }}
  validation={[startDate]}
  {...props}
/>);

export const EndDate = ({ minDate, ...props }) => (<DatePickerForm
  label="Estimated End Date"
  fieldName="end_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: (minDate && minDate !== 'Invalid date') ? formatDateForDatePicker(minDate) : new Date(),
  }}
  validation={[endDate]}
  {...props}
/>);

export const DeadlineDate = ({ minDate, ...props }) => (<DatePickerForm
  label="Application Deadline"
  fieldName="deadline_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: (minDate && minDate !== 'Invalid date') ? formatDateForDatePicker(minDate) : new Date(),
  }}
  {...props}
/>);

export const NotifyDate = ({ minDate, ...props }) => (<DatePickerForm
  label="Notification of Result"
  fieldName="notif_results_date"
  placeholder="Pick a date"
  datePickerProps={{
    minDate: (minDate && minDate !== 'Invalid date') ? formatDateForDatePicker(minDate) : new Date(),
  }}
  validation={[notifResultsDate]}
  {...props}
/>);

export const Weighting = () => (<PolarRadio
  label="Is weighting relevant for this project?"
  fieldName="has_weighting"
/>);

export const FocalPoint = props => (<AgencyFocalPointsField
  label="Project/Programme Focal Point(s)"
  fieldName="focal_points"
  placeholder="Select the name of the Focal Point"
  {...props}
/>);

export const Reviewers = props => (<AgencyReviewersField
  label="Select reviewers"
  fieldName="reviewers"
  placeholder="Search for reviewers"
  {...props}
/>);
