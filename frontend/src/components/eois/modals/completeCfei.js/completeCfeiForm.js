import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import TextFieldForm from '../../../forms/textFieldForm';
import RadioForm from '../../../forms/radioForm';
import GridColumn from '../../../common/grid/gridColumn';
import GridRow from '../../../common/grid/gridRow';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  justification: 'Add justification for completing this CFEI',
  reason: 'Choose reason of completing this CFEI',
};


const RADIO_VALUES = [
  {
    value: 'hq',
    label: 'Headquarters',
  },
  {
    value: 'country',
    label: 'Country Office',
  },
];

const CompleteCfeiForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
          <TextFieldForm
            fieldName="justification"
            label={messages.label}

          />
      </GridColumn>

    </form >
  );
};

CompleteCfeiForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
};

const formEditCfei = reduxForm({
  form: 'completeCfei',
})(CompleteCfeiForm);

const mapStateToProps = (state, ownProps) => {
  const { focal_points,
    start_date,
    end_date,
    deadline_date,
    notif_results_date } = selectCfeiDetails(state, ownProps.id);
  return {
    initialValues: {
      focal_points,
      start_date,
      end_date,
      deadline_date,
      notif_results_date,
    },
  };
};

export default connect(
  mapStateToProps,
)(formEditCfei);
