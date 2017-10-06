import React from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ProjectPartners } from '../../../forms/fields/projectFields/commonFields';
import GridColumn from '../../../common/grid/gridColumn';
import { selectCfeiDetails } from '../../../../store';


const CallPartnersForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectPartners />
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
  const { invited_partners = [] } = selectCfeiDetails(state, ownProps.id);
  return {
    initialValues: { invited_partners },
  };
};

export default connect(
  mapStateToProps,
)(formCallPartners);
