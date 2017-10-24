import React from 'react';
import PropTypes from 'prop-types';
import VerifiedUser from 'material-ui-icons/verifiedUser';

import classname from 'classname';
import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import { reduxForm, FieldArray } from 'redux-form';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import GridColumn from '../../../common/grid/gridColumn';
import { selectCfeiCriteria, selectApplicationProject } from '../../../../store';
import TextFieldForm from '../../../forms/textFieldForm';
import SpreadContent from '../../../common/spreadContent';

import { numerical } from '../../../../helpers/validation';

const messages = {
  criteria: 'Criteria',
  score: 'Your score',
};

const styleSheet = () => ({
  spread: {
    minWidth: 500,
  },
});

const AddReview = (props) => {