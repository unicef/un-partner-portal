import React from 'react';
import PropTypes from 'prop-types';
import { PROJECT_TYPES } from '../../../../helpers/constants';
import CNFeedback from './feedback/CNFeedback';
import DSFeedback from './feedback/DSFeedback';

const CfeiFeedback = (props) => {
  const { params: { type, id } } = props;
  if (type === PROJECT_TYPES.UNSOLICITED) {
    return <CNFeedback id={id} />;
  }
  return <DSFeedback id={id} />;
};

CfeiFeedback.propTypes = {
  params: PropTypes.object,
};


export default CfeiFeedback;
