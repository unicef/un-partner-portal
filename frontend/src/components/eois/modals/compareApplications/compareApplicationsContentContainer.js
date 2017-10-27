import React from 'react';
import PropTypes from 'prop-types';
import SimpleList from '../../../common/list/simpleList';

const columns = [
  { name: 'legal_name', title: 'Partner' },
  { name: 'type_org', title: 'Type of Organization' },
  { name: 'id', title: 'Concept Note ID' },
]

const CompareApplicationContentContainer = (props) => {
  const { partners, loading } = props;
  debugger
  return (<SimpleList
    items={partners}
    columns={columns}
    loading={loading}
  />);
};

CompareApplicationContentContainer.propTypes = {
  partners: PropTypes.array,
};

export default CompareApplicationContentContainer;
