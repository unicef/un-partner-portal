import React from 'react';
import Print from 'material-ui-icons/Print';
import IconWithTextButton from '../../common/iconWithTextButton';
import { authorizedFileDownload } from "../../../helpers/api/api";

const messages = {
  print: 'Print',
};

const PrintButton = (props) => {
  const { id } = props;

  return (<IconWithTextButton
    icon={<Print />}
    text={messages.print}
    onClick={() => authorizedFileDownload({uri: `/partners/${id}/?export=pdf`})}
  />);
};


export default PrintButton;
