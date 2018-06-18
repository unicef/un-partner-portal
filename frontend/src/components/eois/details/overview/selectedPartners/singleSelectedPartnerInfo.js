import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { updateApplication } from '../../../../../reducers/applicationDetails';
import { loadCfei } from '../../../../../reducers/cfeiDetails';
import { selectApplicationCurrentStatus, selectExtendedApplicationStatuses, isCfeiCompleted, selectNormalizedDirectJustification } from '../../../../../store';
import FileForm from '../../../../forms/fileForm';
import TextFieldForm from '../../../../forms/textFieldForm';
import SelectForm from '../../../../forms/selectForm';
import GridColumn from '../../../../common/grid/gridColumn';

const messages = {
  justificationWaiver: 'Justification for direct selection/retention',
  justificationSummary: 'Justification summary',
  attachment: 'Attachment',
};


const SingleSelectedPartnerInfo = (props) => {
  const { directJustifications, form } = props;
  return (
    <form>
      <GridColumn>
        <SelectForm
          values={directJustifications}
          fieldName="ds_justification_select"
          label={messages.justificationWaiver}
          readOnly
        />
        <TextFieldForm
          fieldName="justification_reason"
          label={messages.justificationSummary}
          readOnly
        />
        <FileForm
          fieldName="ds_attachment"
          label={messages.attachment}
          readOnly
          formName="formSingleSelectedPartnerInfo"
        />
      </GridColumn>
    </form>
  );
};

SingleSelectedPartnerInfo.propTypes = {
  partner: PropTypes.object,
  directJustifications: PropTypes.array,
  form: PropTypes.string,
  justification: PropTypes.string,
};

const formSingleSelectedPartnerInfo = reduxForm({
  form: 'singleSelectedPartnerInfo',
  enableReinitialize: true,
})(SingleSelectedPartnerInfo);

const mapStateToProps = (state, ownProps) => {
  const justificationReason = ownProps.partner.justification_reason;
  const dsJustificationSelect = ownProps.partner.ds_justification_select;
  const attachment = ownProps.partner.ds_attachment;
  return {
    directJustifications: selectNormalizedDirectJustification(state),
    initialValues: {
      justification_reason: justificationReason,
      ds_justification_select: dsJustificationSelect,
      ds_attachment: attachment,
    },
  };
};


const mapDispatchToProps = (dispatch, { id, partner = {} }) => ({
  acceptSelection: () => dispatch(updateApplication(partner.id,
    { did_accept: true, did_decline: false })),
  loadCfei: () => dispatch(loadCfei(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(formSingleSelectedPartnerInfo);
