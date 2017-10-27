/* eslint-disable */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Feedback from './applications/feedback/feedbackContainer';


class Dev extends Component {
  render() {
    return (
      <div>
        <Feedback
          applicationId={1}
        />
      </div>

    );
  }
}



export default Dev;

