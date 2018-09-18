import React from 'react';
import Print from 'material-ui-icons/Print';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  print: 'Print',
};

const PrintButton = (props) => {
  const { id } = props;

  return (<IconWithTextButton
    icon={<Print />}
    text={messages.print}
    onClick={() => window.open(`/api/partners/${id}/?export=pdf`, '_self')}
  />);
};


export default PrintButton;
