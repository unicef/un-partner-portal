import React from 'react';
import Print from 'material-ui-icons/Print';
import IconWithTextButton from '../../common/iconWithTextButton';

const messages = {
  print: 'Print',
};

const PrintButton = () => (
  <IconWithTextButton
    icon={<Print />}
    text={messages.print}
    onClick={window.print}
  />
);


export default PrintButton;
