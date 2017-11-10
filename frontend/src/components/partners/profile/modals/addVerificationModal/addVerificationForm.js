import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import GridColumn from '../../../../common/grid/gridColumn';
import VerificationQuestion from './verificationQuestion';


const messages = {
  certUpload: 'Has partner uploaded its valid, non-expired registration certificate issued by the ' +
  'correct goverment body?',
  mmConsistent: 'Are the partner\'s mandate and mission consistent with that of the UN?',
  indicateResults: 'Do the partner\'s key results achieved indicate abillity to deliver programme ' +
  'results?',
  repRisk: 'Has a potential reputational risk issue been identified from public or other sources?',
  yellowFlag: 'Does the partner have a "yellow" flag in its profile, indication reputational risk?',
};


const verificationQuestions = [
  {
    question: messages.certUpload,
    questionFieldName: 'is_cert_uploaded',
    commentFieldName: 'cert_uploaded_comment',
  },
  {
    question: messages.mmConsistent,
    questionFieldName: 'is_mm_consistent',
    commentFieldName: 'mm_consistent_comment',
  },
  {
    question: messages.indicateResults,
    questionFieldName: 'is_indicate_results',
    commentFieldName: 'indicate_results_comment',
  },
  {
    question: messages.repRisk,
    questionFieldName: 'is_rep_risk',
    commentFieldName: 'rep_risk_comment',
  },
  {
    question: messages.yellowFlag,
    questionFieldName: 'is_yellow_flag',
    commentFieldName: 'yellow_flag_comment',
  },
];

const renderQuestions = (questions, readOnly) => (
  questions.map(({ question, questionFieldName, commentFieldName }) => (<GridColumn>
    <VerificationQuestion
      question={question}
      questionFieldName={questionFieldName}
      commentFieldName={commentFieldName}
      readOnly={readOnly}
    />
    <Divider />
  </GridColumn>),
  ));

const AddVerification = (props) => {
  const { handleSubmit, readOnly } = props;
  return (
    <form onSubmit={handleSubmit}>
      {renderQuestions(verificationQuestions, readOnly)}
    </form >
  );
};

AddVerification.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

const formAddVerification = reduxForm({
  form: 'addVerification',
})(AddVerification);

export default formAddVerification;
