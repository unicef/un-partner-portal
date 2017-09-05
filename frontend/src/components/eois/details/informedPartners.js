import React from 'react';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import HeaderList from '../../common/list/headerList';

const messages = {
  title: 'Informed Partner(s)',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const InformedPartners = (props) => {
  return (
    <HeaderList
      header={title}
      rows={['Parter1', 'Partner2']}
    />
  );
};

export default InformedPartners;
