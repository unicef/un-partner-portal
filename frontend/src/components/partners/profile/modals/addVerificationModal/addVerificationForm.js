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
import GridColumn from '../../../../common/grid/gridColumn';
import { selectCfeiCriteria, selectApplicationProject } from '../../../../../store';
import TextFieldForm from '../../../../forms/textFieldForm';
import SpreadContent from '../../../../common/spreadContent';

import { numerical } from '../../../../../helpers/validation';

const messages = {
  criteria: 'Criteria',
  score: 'Your score',
};

const styleSheet = () => ({
  spread: {
    minWidth: 500,
  },
});

const renderCriteria = ({ criteria, allCriteria, fields }) => (<div>
  {fields.map((name, index) => (<div>
    <Grid container direction="row" align="center" justify="center">
      <Grid item xs={9}>
        <Typography type="subheading">
          {allCriteria[criteria[index].selection_criteria]}
        </Typography>
        <Typography type="caption">
          {criteria[index].description}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextFieldForm
          label=""
          fieldName={`${name}.score`}
          placeholder="Score..."
          textFieldProps={{
            inputProps: {
              min: '1',
              max: '100',
              type: 'number',
            },
          }}
          normalize={value => parseInt(value)}
          validation={[numerical]}
        />
      </Grid>
    </Grid>
    <Divider />
  </div>))}
</div>
);


const AddReview = (props) => {
  const { classes, handleSubmit, criteria, allCriteria } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <SpreadContent className={classes.spread}>
          <Typography type="caption">{messages.criteria}</Typography>
          <Typography type="caption">{messages.score}</Typography>
        </SpreadContent>
        <Divider />
        <FieldArray
          name="scores"
          component={renderCriteria}
          criteria={criteria}
          allCriteria={allCriteria}
        />
        <TextFieldForm
          label="Notes (optional)"
          fieldName="note"
          placeholder="Enter any notes/comments"
          optional
          {...props}
        />
      </GridColumn>
    </form >
  );
};

AddReview.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object,
  allCriteria: PropTypes.array,
  criteria: PropTypes.object,
};

const formAddReview = reduxForm({
  form: 'addReview',
})(AddReview);

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps.params;
  const eoi = selectApplicationProject(state, applicationId);
  const criteria = selectCfeiCriteria(state, eoi);
  return {
    criteria,
    allCriteria: state.selectionCriteria,
    initialValues: {
      scores: R.pathOr(criteria, ['scores', 'scores'], ownProps),
      note: R.pathOr(null, ['scores', 'note'], ownProps) },
  };
};

export default withRouter(connect(
  mapStateToProps,
)(withStyles(styleSheet)(formAddReview)));
