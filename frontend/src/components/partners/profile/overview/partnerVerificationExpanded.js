import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import { visibleIfYes } from '../../../../helpers/formHelper';
import GridColumn from '../../../common/grid/gridColumn';
import VerificationQuestion from '../../../../components/partners/profile/modals/addVerificationModal/verificationQuestion';

const messages = {
  certUpload: 'Has partner uploaded its valid, non-expired registration certificate issued by the ' +
  'correct goverment body?',
  mmConsistent: 'Are the partner\'s mandate and mission consistent with that of the UN?',
  observationsPose: 'Do these observations pose unacceptable risk to the UN?',
  riskRelated: 'Are there any other risk-related observations associated with the CSO/partner that are not captured in UN Partner Portal, but which pose unacceptable risk to the UN?',
  indicateResults: 'Does the partner have mechanisms to combat fraud and corruption, prevent sexual exploitation and abuse, and protect and safeguard beneficiaries?',
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

const partnerVerificationExpanded = (props) => {
  const { handleSubmit, readOnly } = props;

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
        <VerificationQuestion
          question={verificationQuestions[3].question}
          questionFieldName={verificationQuestions[3].questionFieldName}
          commentFieldName={verificationQuestions[3].commentFieldName}
          readOnly={readOnly}
        />
      </GridColumn>
      <GridColumn>
        <VerificationQuestion
          question={verificationQuestions[4].question}
          questionFieldName={verificationQuestions[4].questionFieldName}
          commentFieldName={verificationQuestions[4].commentFieldName}
          readOnly={readOnly}
        />
      </GridColumn>
    </form >
  );
};

partnerVerificationExpanded.propTypes = {
  /**
     * callback for form submit
     */
  handleSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool, 
};


const formPartnerVerificationExpanded = reduxForm({
  destroyOnUnmount: false,
})(partnerVerificationExpanded);


const mapStateToProps = (state, ownProps) => {
  const selector = formValueSelector(ownProps.form);
  return {
    isYellowFlag: selector(state, 'is_yellow_flag'),
    notCertUploaded: selector(state, 'is_cert_uploaded') === false,
  };
};

export default connect(mapStateToProps, null)(formPartnerVerificationExpanded);
