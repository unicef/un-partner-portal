import React from 'react';
import { reduxForm, FormSection } from 'redux-form';
import PropTypes from 'prop-types';

import Grid from 'material-ui/Grid';
import {
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import * as fields from './commonFields';
import ModalContentHeader from '../../common/modals/modalContentHeader';
import ModalMainContent from '../../common/modals/modalMainContent';

const messages = {
  headerTitle: 'This CFEI is for open selections.',
  headerBody: 'If you would like to notify specific partners about this CFEI, you can select ' +
  'their names on the next page of this form.',
  cancel: 'Cancel',
  ok: 'Ok',
  projectDetails: 'Project Details',
  conceptNoteTemplate: 'Concept Note Template',
  selectionCriteria: 'Selection Criteria',
};

const RegistrationStep = (props) => {
  const { handleSubmit, onCancel } = props;
  return (
    <form onSubmit={handleSubmit}>
      <ModalContentHeader
        titleText={messages.headerTitle}
        bodyText={messages.headerBody}
      />
      <ModalMainContent>
        <Typography type="headline">
          {messages.projectDetails}
        </Typography>
        <FormSection name="eoi">
          <Grid container direction="column" gutter={16}>
            <fields.TitleField />
            <fields.FocalPoint />
            <fields.Population />
            <fields.Background />
            <fields.OtherInfo />
            <Grid item>
              <Grid container direction="row">
                <Grid item xs={12} sm={3}>
                  <fields.StartDate />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <fields.EndDate />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <fields.DeadlineDate />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <fields.NotifyDate />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormSection>
        <Typography type="headline">
          {messages.conceptNoteTemplate}
        </Typography>
        <FormSection name="eoi">
          <fields.ConceptNoteTemplate />
        </FormSection>
        <Typography type="headline">
          {messages.selectionCriteria}
        </Typography>
        <FormSection name="eoi">
          <fields.Weighting />
        </FormSection>
        <DialogActions>
          <Button onTouchTap={onCancel} color="accent">
            {messages.cancel}
          </Button>
          <Button onTouchTap={handleSubmit} raised color="accent">
            {messages.ok}
          </Button>
        </DialogActions>
      </ModalMainContent>
    </form >
  );
};

RegistrationStep.propTypes = {
  /**
   * callback for 'next' button
   */
  handleSubmit: PropTypes.func.isRequired,
  /**
   * callback for 'back' button
   */
  handlePrev: PropTypes.func,
  /**
   * component to be wrapped
   */
  children: PropTypes.node.isRequired,
  /**
   * whether step is the first, to control buttons appearance
   */
  first: PropTypes.bool,
  /**
   * whether step is the last, to control buttons appearance
   */
  last: PropTypes.bool,
  /**
   * callback for 'back' button
   */
  reset: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'newOpenCfei',
})(RegistrationStep);
