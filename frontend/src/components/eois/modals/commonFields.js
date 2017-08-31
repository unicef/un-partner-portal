import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import R from 'ramda';

import Grid from 'material-ui/Grid';

import TextFieldForm from '../../forms/textFieldForm';
import SelectForm from '../../forms/selectForm';
import DatePickerForm from '../../forms/datePickerForm';
import PolarRadio from '../../forms/fields/PolarRadio';
import FileForm from '../../forms/fileForm';

const messages = {

};

export const TitleField = () => (<TextFieldForm
  label="Project Title"
  fieldName="title"
  placeholder="Enter Project Title"
/>);

export const FocalPoint = () => (<TextFieldForm
  label="Project/Programme Focal Point(s)"
  fieldName="focal_point"
  placeholder="Enter the name of the Focal Point"
/>);

export const Population = () => (<SelectForm
  label="Intended populations of concern (only for UNHCR)"
  fieldName="population"
  placeholder="Enter the name of the Focal Point"
  values={[]}
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
/>);

export const EndDate = () => (<DatePickerForm
  label="Estimated Start Date"
  fieldName="end_date"
  placeholder="Pick a date"
/>);

export const DeadlineDate = () => (<DatePickerForm
  label="Application Deadline"
  fieldName="deadline_date"
  placeholder="Pick a date"
/>);

export const NotifyDate = () => (<DatePickerForm
  label="Notification of Result"
  fieldName="notif_results_date"
  placeholder="Pick a date"
/>);

export const Weighting = () => (<PolarRadio
  label="Is weighting relevant for this project?"
  fieldName="has_weighting"
/>);

export const ConceptNoteTemplate = () => (<FileForm
  label="Concept Note Template"
  fieldName="cn_template"
  placeholder="Upload file"
/>);
