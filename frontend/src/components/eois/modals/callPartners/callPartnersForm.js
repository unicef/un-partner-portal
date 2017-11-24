import React from 'react';
import R from 'ramda';
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
  const { handleSubmit, invitedPartners, countries, ...other } = props;
  return (
    <form onSubmit={handleSubmit}>
      <GridColumn>
        <ProjectPartners
          fieldName={'invited_partners'}
          label={messages.label}
          initialMultiValues={invitedPartners}
          countries={countries}
          {...other}
        />
      </GridColumn>
    </form >
  );
};

CallPartnersForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  invitedPartners: PropTypes.array,
  countries: PropTypes.array,

};

const formCallPartners = reduxForm({
  form: 'callPartners',
})(CallPartnersForm);

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id) || {};
  const { invited_partners = [], locations = [] } = cfei;
  const countries = R.pluck('country', locations);
  return {
    initialValues: { invited_partners: R.pluck('id', invited_partners) },
    invitedPartners: R.pluck('legal_name', invited_partners),
    countries,
  };
};

export default connect(
  mapStateToProps,
)(formCallPartners);
