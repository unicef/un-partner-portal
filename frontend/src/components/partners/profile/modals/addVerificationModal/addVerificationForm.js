import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { visibleIfYes } from '../../../../../helpers/formHelper';
import GridColumn from '../../../../common/grid/gridColumn';
import VerificationQuestion from './verificationQuestion';


const messages = {
  certUpload: 'Has partner uploaded its valid, non-expired registration certificate issued by the ' +
  'correct goverment body?',
  missingReason: 'Is CSO\'s reason for missing registration certificate acceptable?',
  mmConsistent: 'Are the partner\'s mandate and mission consistent with that of the UN?',
  indicateResults: 'Do the partner\'s key results achieved indicate ability to deliver programme ' +
  'results?',
  repRisk: 'Has a potential reputational risk issue been identified from public or other sources?',
  yellowFlag: 'Does the partner have a "yellow" flag in its profile, indicating reputational risk?',
  canVerify: 'Can partner be verified in spite of reputional risk?',
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
    question: messages.repRisk,
    questionFieldName: 'is_rep_risk',
    commentFieldName: 'rep_risk_comment',
  },
  {
    id: 4,
    question: messages.yellowFlag,
    questionFieldName: 'is_yellow_flag',
    commentFieldName: 'yellow_flag_comment',
  },
  {
    question: messages.canVerify,
    questionFieldName: 'can_verify',
    commentFieldName: 'can_verify_comment',
  },
  {
    question: messages.missingReason,
    questionFieldName: 'is_reason_acceptable',
    commentFieldName: 'reason_acceptable_comment',
  },
];

const AddVerification = (props) => {
  const { handleSubmit, readOnly, isYellowFlag, notCertUploaded } = props;

  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[0].question}
          questionFieldName={verificationQuestions[0].questionFieldName}
          commentFieldName={verificationQuestions[0].commentFieldName}
          readOnly={readOnly}
        />
        <Divider />
        {visibleIfYes(notCertUploaded)
          ? <GridColumn>
            <VerificationQuestion
              question={verificationQuestions[6].question}
              questionFieldName={verificationQuestions[6].questionFieldName}
              commentFieldName={verificationQuestions[6].commentFieldName}
              readOnly={readOnly}
            />
            <Divider />
          </GridColumn>
          : null}
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[1].question}
          questionFieldName={verificationQuestions[1].questionFieldName}
          commentFieldName={verificationQuestions[1].commentFieldName}
          readOnly={readOnly}
        />
        <Divider />
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[2].question}
          questionFieldName={verificationQuestions[2].questionFieldName}
          commentFieldName={verificationQuestions[2].commentFieldName}
          readOnly={readOnly}
        />
        <Divider />
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[3].question}
          questionFieldName={verificationQuestions[3].questionFieldName}
          commentFieldName={verificationQuestions[3].commentFieldName}
          readOnly={readOnly}
        />
        <Divider />
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[4].question}
          questionFieldName={verificationQuestions[4].questionFieldName}
          commentFieldName={verificationQuestions[4].commentFieldName}
          readOnly={readOnly}
        />
        <Divider />
      </GridColumn>
      {visibleIfYes(isYellowFlag)
        ? <GridColumn>
          <VerificationQuestion
            question={verificationQuestions[5].question}
            questionFieldName={verificationQuestions[5].questionFieldName}
            commentFieldName={verificationQuestions[5].commentFieldName}
            readOnly={readOnly}
          />
          <Divider />
        </GridColumn>
        : null}
    </form >
  );
};

AddVerification.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  isYellowFlag: PropTypes.bool,
  notCertUploaded: PropTypes.array,
};

const selector = formValueSelector('addVerification');

const formAddVerification = reduxForm({
  form: 'addVerification',
})(AddVerification);


const mapStateToProps = state => ({
  isYellowFlag: selector(state, 'is_yellow_flag'),
  notCertUploaded: selector(state, 'is_cert_uploaded') === false,
});

export default connect(mapStateToProps, null)(formAddVerification);
