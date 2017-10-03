import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';

import * as fields from './commonFields';
import GridColumn from '../../common/grid/gridColumn';

import ProjectDetails from './ProjectDetails';
import { loadPartnerNames } from '../../../reducers/partnerNames';
import PartnersForm from '../../forms/fields/projectFields/partnersField/partnersFieldArray';

const messages = {

  selectPartners: 'Select Partners',
  selectionCriteria: 'Selection Criteria',
};

class DirectForm extends Component {
  componentWillMount() {
    this.props.getPartnerNames();
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <GridColumn>
          <ProjectDetails
            dateFields={[
              <fields.StartDate />,
              <fields.EndDate />,
            ]}
          />
          <Typography type="headline">
            {messages.selectPartners}
          </Typography>
          <PartnersForm />
        </GridColumn>
      </form >
    );
  }
}

DirectForm.propTypes = {
  /**
   * callback for form submit
   */
  handleSubmit: PropTypes.func.isRequired,
  getPartnerNames: PropTypes.func,

};

const mapDispatchToProps = dispatch => ({
  getPartnerNames: () => dispatch(loadPartnerNames()),
});

const connectedDirectForm = connect(
  null,
  mapDispatchToProps,
)(DirectForm);

export default reduxForm({
  form: 'newDirectCfei',
})(connectedDirectForm);

