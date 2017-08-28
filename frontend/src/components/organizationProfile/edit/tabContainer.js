import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CustomTab from '../../common/customTab';

const TabContainer = (props) => {
  const { label, name, incompleteTabs, ...tabProps } = props;
  const warn = incompleteTabs.includes(name);
  return (
    <CustomTab
      label={label}
      warn={warn}
      {...tabProps}
    />
  );
};

TabContainer.propTypes = {
  incompleteTabs: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  name: PropTypes.string,
  iconStyle: PropTypes.string,
};

const mapState = state => ({
  incompleteTabs: state.partnerProfileEdit.incompleteTabs,
});

export default connect(
  mapState,
)(TabContainer);
