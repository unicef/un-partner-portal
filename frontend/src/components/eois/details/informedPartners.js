import React from 'react';
import Typography from 'material-ui/Typography';
import GridColumn from '../../common/grid/gridColumn';
import HeaderList from '../../common/list/headerList';
import PaddedContent from '../../common/paddedContent';

const messages = {
  title: 'Informed Partner(s)',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const data = [
  { name: 'Partner0', date: '27 Feb 2017' },
  { name: 'Partner2', date: '27 Feb 2017' },
  { name: 'Partner3', date: '27 Feb 2017' },
];

const renderRow = partners => partners.map(partner => (
  <PaddedContent>
    <Typography type="SubHeading">{partner.name}</Typography>
    <Typography>{partner.date} </Typography>
  </PaddedContent>
));


const InformedPartners = (props) => {
  return (
    <HeaderList
      header={title}
      rows={renderRow(data)}
    />
  );
};

export default InformedPartners;
