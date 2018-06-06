import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PaddedContent from '../../../../common/paddedContent';
import { selectCfeiDetails, isUserAFocalPoint, isUserACreator } from '../../../../../store';
import SingleSelectedPartner from './singleSelectedPartner';
import SingleSelectedPartnerInfo from './singleSelectedPartnerInfo';

const messages = {
  title: 'Selected Partner(s)',
};

const title = () => (
  <Typography type="headline" >{messages.title}</Typography>
);

const renderRow = (partners, isUserFocalPoint, id) => partners.map((partner, index) => (
  <div>
    <PaddedContent key={partner.id}>
      <SingleSelectedPartner
        key={`partner_${index}`}
        isFocalPoint={isUserFocalPoint}
        partner={partner}
        id={id}
      />
    </PaddedContent>
    <Divider />
    <PaddedContent>
      <SingleSelectedPartnerInfo
        key={`partner_info_${index}`}
        isFocalPoint={isUserFocalPoint}
        partner={partner}
        id={id}
      />
    </PaddedContent>
  </div>
));


const SelectedPartners = (props) => {
  const { partners, isUserFocalPoint, id } = props;

  return (
    <HeaderList
      header={title}
    >
      {renderRow(partners, isUserFocalPoint, id)}
    </HeaderList>
  );
};

SelectedPartners.propTypes = {
  partners: PropTypes.array,
  isUserFocalPoint: PropTypes.bool,
  id: PropTypes.number,
};


const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    partners: cfei ? cfei.direct_selected_partners : [],
    isUserFocalPoint: isUserAFocalPoint(state, ownProps.id) || isUserACreator(state, ownProps.id),
  };
};

SelectedPartners.defaultProps = {
  partners: [],
};

export default connect(
  mapStateToProps,
)(SelectedPartners);
