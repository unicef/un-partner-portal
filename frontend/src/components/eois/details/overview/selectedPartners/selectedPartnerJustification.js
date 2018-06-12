import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { selectCfeiDetails } from '../../../../../store';
import TextFieldForm from '../../../../forms/textFieldForm';
import GridColumn from '../../../../common/grid/gridColumn';
import PaddedContent from '../../../../common/paddedContent';
import HeaderList from '../../../../common/list/headerList';

const messages = {
  justificationWaiver: 'Justification for direct selection/retention',
  justificationSummary: 'Justification summary',
  attachment: 'Attachment',
};


const SelectedPartnerJustification = (props) => {
  const { form, id, partner } = props;
  return (
    <form>
      <HeaderList
        header={messages.justificationSummary}
      >
        <PaddedContent>
          <GridColumn>
            <TextFieldForm
              fieldName="justification"
              readOnly
              id={id}
            />
          </GridColumn>
        </PaddedContent>
      </HeaderList>
    </form>
  );
};

SelectedPartnerJustification.propTypes = {
  partner: PropTypes.object,
  directJustifications: PropTypes.array,
  form: PropTypes.string,
  justification: PropTypes.string,
  id: PropTypes.number,
};

const formSelectedPartnerJustification = reduxForm({
  form: 'justificationDetails',
  enableReinitialize: true,
})(SelectedPartnerJustification);

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);

  return {
    initialValues: {
      justification: cfei ? cfei.justification : '',
    },
  };
};

export default connect(mapStateToProps)(formSelectedPartnerJustification);
