import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import GridColumn from '../../../../common/grid/gridColumn';
import VerificationQuestion from './verificationQuestion';
import ObservationsTable from './observationsTable';
import CheckboxForm from '../../../../forms/checkboxForm';

const styleSheet = (theme) => {
  const spacing = theme.spacing.unit;
  return {
    question: {
      padding: `${spacing}px ${spacing}px ${spacing}px 0px`,
      alignItems: 'center',
      backgroundColor: theme.palette.common.lightGreyBackground,
    },
  };
};

const messages = {
  certUpload: 'Has the CSO/partner uploaded its valid, non-expired registration certificate issued by the correct government body, or otherwise indicated eligibility to operate in the country?',
  mmConsistent: 'Are the mandate and mission of the CSO/partner consistent with that of the UN?',
  indicateResults: 'Does the CSO/partner have mechanisms to combat fraud and corruption, prevent sexual exploitation and abuse, and protect and safeguard beneficiaries?',
  observationsPose: 'Do these observations pose unacceptable risk to the UN?',
  riskRelated: 'Are there any other risk-related observations associated with the CSO/partner that are not captured in UN Partner Portal, but which pose unacceptable risk to the UN?',
  confirmVerification: 'I certify that the information provided in this verification form is accurate to the best of my knowledge.',
};

const verificationQuestions = [
  {
    id: 0,
    question: messages.certUpload,
    questionFieldName: 'is_cert_uploaded',
    commentFieldName: 'cert_uploaded_comment',
  },
  {
    id: 1,
    question: messages.mmConsistent,
    questionFieldName: 'is_mm_consistent',
    commentFieldName: 'mm_consistent_comment',
  },
  {
    id: 2,
    question: messages.indicateResults,
    questionFieldName: 'is_indicate_results',
    commentFieldName: 'indicate_results_comment',
  },
  {
    id: 3,
    question: messages.observationsPose,
    questionFieldName: 'is_yellow_flag',
    commentFieldName: 'yellow_flag_comment',
  },
  {
    id: 4,
    question: messages.riskRelated,
    questionFieldName: 'is_rep_risk',
    commentFieldName: 'rep_risk_comment',
  },
];

const AddVerification = (props) => {
  const { classes, handleSubmit, readOnly, isYellowFlag, notCertUploaded } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[0].question}
          questionFieldName={verificationQuestions[0].questionFieldName}
          commentFieldName={verificationQuestions[0].commentFieldName}
          readOnly={readOnly}
        />
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[1].question}
          questionFieldName={verificationQuestions[1].questionFieldName}
          commentFieldName={verificationQuestions[1].commentFieldName}
          readOnly={readOnly}
        />
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[2].question}
          questionFieldName={verificationQuestions[2].questionFieldName}
          commentFieldName={verificationQuestions[2].commentFieldName}
          readOnly={readOnly}
        />
      </GridColumn>
      <GridColumn>
        <ObservationsTable>
          <VerificationQuestion
            question={verificationQuestions[3].question}
            questionFieldName={verificationQuestions[3].questionFieldName}
            commentFieldName={verificationQuestions[3].commentFieldName}
            readOnly={readOnly}
          />
        </ObservationsTable>
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[4].question}
          questionFieldName={verificationQuestions[4].questionFieldName}
          commentFieldName={verificationQuestions[4].commentFieldName}
          readOnly={readOnly}
        />
      </GridColumn>
      <GridColumn>
        <div className={classes.question}>
          <CheckboxForm
            fieldName="confirm_verification"
            label={messages.confirmVerification}
            labelType="body2"
            optional
          /></div>
      </GridColumn>
    </form >
  );
};

AddVerification.propTypes = {
  classes: PropTypes.object,
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  isYellowFlag: PropTypes.bool,
  notCertUploaded: PropTypes.bool,
};

const selector = formValueSelector('addVerification');

const formAddVerification = reduxForm({
  form: 'addVerification',
})(AddVerification);


const mapStateToProps = state => ({
  isYellowFlag: selector(state, 'is_yellow_flag'),
  notCertUploaded: selector(state, 'is_cert_uploaded') === false,
});

const connected = connect(mapStateToProps, null)(formAddVerification);

export default withStyles(styleSheet, { name: 'AddVerification' })(connected);
