import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProjectPartners from '../../../forms/fields/projectFields/partnersField/ProjectPartners';
import GridColumn from '../../../common/grid/gridColumn';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  label: 'Partners',
};

const CallPartnersForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectPartners fieldName={'invited_partners'} label={messages.label} />
      </GridColumn>
    </form >
  );
};

CallPartnersForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,

};

const formCallPartners = reduxForm({
  form: 'callPartners',
})(CallPartnersForm);

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id) || {};
  const { invited_partners = [] } = cfei;
  return {
    initialValues: { invited_partners },
  };
};

export default connect(
  mapStateToProps,
)(formCallPartners);
