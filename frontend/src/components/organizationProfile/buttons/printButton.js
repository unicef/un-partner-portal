import React from 'react';
import Save from 'material-ui-icons/Save';
import IconWithTextButton from '../../common/iconWithTextButton';
import { authorizedFileDownload } from "../../../helpers/api/api";

const messages = {
  print: 'Download as PDF',
};

const PrintButton = (props) => {
  const { id } = props;

  return (<IconWithTextButton
    icon={<Save />}
    text={messages.print}
    onClick={() => authorizedFileDownload({uri: `/partners/${id}/?export=pdf`})}
  />);
};


export default PrintButton;
