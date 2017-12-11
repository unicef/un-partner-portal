import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import PaddedContent from '../../../common/paddedContent';
import { selectCfeiDetails } from '../../../../store';

const messages = {
  title: 'Invited Partner(s)',
};

const title = () => (
  <Typography type="headline" >{messages.title}</Typography>
);

const renderRow = (partners) => {
  return partners.map(({ id, legal_name }) => (
    <PaddedContent key={id}>
      <Typography type="subheading">{legal_name}</Typography>
    </PaddedContent>
  ));
};

const InformedPartners = (props) => {
  const { partners, partnerNames } = props;
  return (
    <HeaderList
      header={title}
    >
      {renderRow(partners, partnerNames)}
    </HeaderList>
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
  };
};

InformedPartners.defaultProps = {
  partners: [],
};

export default connect(
  mapStateToProps,
)(InformedPartners);
