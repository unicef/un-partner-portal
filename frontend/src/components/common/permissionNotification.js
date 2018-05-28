import Card from './card';
import React from 'react';
import PropTypes from 'prop-types';

const messages = {
  title: 'Permission restriction',
  body: 'You dont have permissions to view this page',
};

const PermissionNotification = (props) => {
  const { title, body } = props;
  return (<Card title={messages.title}>
    {messages.body}
  </Card>);
};

PermissionNotification.PropTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default PermissionNotification;
