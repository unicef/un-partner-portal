import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import SpreadContent from '../../../../common/spreadContent';
import PolarRadio from '../../../../forms/fields/PolarRadio';
import TextForm from '../../../../forms/textFieldForm';
import GridColumn from '../../../../common/grid/gridColumn';

const messages = {
  comment: 'Comment',
};

const styleSheet = (theme) => {
  const spacing = theme.spacing.unit;
  return {
    padding: {
      padding: `0px ${spacing}px ${spacing}px ${spacing}px`,
      alignItems: 'center',
    },
    background: {
      backgroundColor: theme.palette.common.lightGreyBackground,
    },
    questionMargin: {
      marginRight: spacing,
    },
  };
};

const VerificationQuestion = (props) => {
  const { classes, question, questionFieldName, commentFieldName, readOnly, warn } = props;
  return (
    <GridColumn spacing={8}>
      <SpreadContent className={`${classes.padding} ${classes.background}`}>
        <Typography type="body2" className={classes.questionMargin}>
          {question}
        </Typography>
        <PolarRadio warn={warn} fieldName={questionFieldName} readOnly={readOnly} />
      </SpreadContent>
      <div className={classes.padding}>
        <TextForm
          label={messages.comment}
          fieldName={commentFieldName}
          warn={warn}
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: '300',
              },
            },
          }}
          readOnly={readOnly}
        />
      </div>
    </GridColumn>
  );
};

VerificationQuestion.propTypes = {
  classes: PropTypes.object,
  question: PropTypes.string,
  questionFieldName: PropTypes.string,
  commentFieldName: PropTypes.string,
  readOnly: PropTypes.bool,
  warn: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'VerificationQuestion' })(VerificationQuestion);
