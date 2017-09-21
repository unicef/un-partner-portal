import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  title: 'Informed Partner(s)',
};

const title = () => (
  <Typography type="subheading" >{messages.title}</Typography>
);

const renderRow = partners => partners.map(partner => (
  <PaddedContent>
    <Typography type="subheading">{partner.legal_name}</Typography>
  </PaddedContent>
));


const InformedPartners = (props) => {
  const { partners } = props;
  return (
    <HeaderList
      header={title}
      rows={renderRow(partners)}
    />
  );
};

InformedPartners.propTypes = {
  partners: PropTypes.array,
};


const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    partners: cfei ? cfei.invited_partners : [],
  };
};

export default connect(
  mapStateToProps,
)(InformedPartners);
