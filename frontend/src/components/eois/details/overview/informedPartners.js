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
  <Typography type="headline" >{messages.title}</Typography>
);

const renderRow = (partners, partnerNames) => partners.map(partner => (
  <PaddedContent>
    <Typography type="subheading">{partnerNames[partner]}</Typography>
  </PaddedContent>
));


const InformedPartners = (props) => {
  const { partners, partnerNames } = props;
  return (
    <HeaderList
      header={title}
      rows={renderRow(partners, partnerNames)}
    />
  );
};

InformedPartners.propTypes = {
  partners: PropTypes.array,
  partnerNames: PropTypes.object,
};


const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    partners: cfei ? cfei.invited_partners : [],
    partnerNames: state.partnerNames || {},
  };
};

export default connect(
  mapStateToProps,
)(InformedPartners);
