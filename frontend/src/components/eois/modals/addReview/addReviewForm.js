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

import { validateReviewScores } from '../../../../helpers/validation';

const messages = {
  criteria: 'Criteria',
  score: 'Your score',
};

const styleSheet = theme => ({
  spread: {
    minWidth: 500,
  },
  weight: {
    display: 'flex',
    alignItems: 'flex-end',
    minHeight: theme.spacing.unit * 4,
  },
});

const renderCriteriaBase = ({ classes, criteria, allCriteria, fields }) => (<div>
  {fields.map((name, index) => (<div>
    <Grid container direction="row" alignItems="center" justify="center">
      <Grid item xs={9}>
        <Typography type="subheading">
          {allCriteria[criteria[index].selection_criteria]}
        </Typography>
        <Typography type="caption">
          {criteria[index].description}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <TextFieldForm
          label=""
          fieldName={`${name}.score`}
          placeholder="Score..."
          textFieldProps={{
            inputProps: {
              min: '1',
              max: criteria[index].weight || '100',
              type: 'number',
            },
          }}
          normalize={value => parseInt(value)}
        />
      </Grid>
      {criteria[index].weight && <Grid item xs={1}>
        <Typography className={classes.weight}>{`/${criteria[index].weight}`}</Typography>
      </Grid>}
    </Grid>
    <Divider />
  </div>))}
</div>
);

renderCriteriaBase.propTypes = {
  classes: PropTypes.object,
  criteria: PropTypes.array,
  allCriteria: PropTypes.array,
  fields: PropTypes.array,
};

const renderCriteria = withStyles(styleSheet)(renderCriteriaBase);


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
  validate: validateReviewScores,
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
