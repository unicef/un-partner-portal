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
import { selectCfeiCriteria, selectApplicationProject, selectCfeiDetails } from '../../../../store';
import TextFieldForm from '../../../forms/textFieldForm';
import CheckboxForm from '../../../forms/checkboxForm';
import SpreadContent from '../../../common/spreadContent';
import { visibleIfYes } from '../../../../helpers/formHelper';

import { validateReviewScores } from '../../../../helpers/validation';

const messages = {
  criteria: 'Criteria',
  score: 'Your score',
  confirmReview: 'I confirm that these scores are entered on behalf of review committee',
};

const styleSheet = theme => ({
  spread: {
    minWidth: 600,
  },
  weight: {
    display: 'flex',
    alignItems: 'flex-end',
    minHeight: theme.spacing.unit * 4,
  },
});

const renderCriteriaBase = ({ classes, criteria, allCriteria, fields }) => (<div>
  {fields.map((name, index) => (<div key={name}>
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
            InputProps: {
              inputProps: {
                min: '1',
                max: criteria[index].weight || '100',
                type: 'number',
              },
            },
          }}
          normalize={(value) => {
            if (value) return parseInt(value);
            return value;
          }}
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
  allCriteria: PropTypes.object,
  fields: PropTypes.object,
};

const renderCriteria = withStyles(styleSheet)(renderCriteriaBase);


const AddReview = (props) => {
  const { classes, handleSubmit, criteria, allCriteria, isSingleReviewer } = props;
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
        {visibleIfYes(isSingleReviewer)
          ? <CheckboxForm
            fieldName="is_a_committee_score"
            label={messages.confirmReview}
            optional
          />
          : null}
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
  allCriteria: PropTypes.object,
  criteria: PropTypes.array,
  isSingleReviewer: PropTypes.bool,
};

const formAddReview = reduxForm({
  form: 'addReview',
  validate: validateReviewScores,
})(AddReview);

const mapStateToProps = (state, ownProps) => {
  const { applicationId } = ownProps.params;
  const eoi = selectApplicationProject(state, applicationId);
  const criteria = selectCfeiCriteria(state, eoi);
  const cfeiDetails = selectCfeiDetails(state, eoi);
  return {
    criteria,
    isSingleReviewer: cfeiDetails.reviewers.length === 1,
    allCriteria: state.selectionCriteria,
    initialValues: {
      scores: R.pathOr(criteria, ['scores', 'scores'], ownProps),
      note: R.pathOr(null, ['scores', 'note'], ownProps) },
  };
};

export default withRouter(connect(
  mapStateToProps,
)(withStyles(styleSheet)(formAddReview)));
