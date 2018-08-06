import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../../common/list/headerList';
import PaddedContent from '../../../../common/paddedContent';
import { selectCfeiDetails } from '../../../../../store';
import SingleSelectedPartner from './singleSelectedPartner';
import SingleSelectedPartnerInfo from './singleSelectedPartnerInfo';
import { PROJECT_STATUSES } from '../../../../../helpers/constants';

const messages = {
  title: 'Selected Partner(s)',
};

const title = () => (
  <Typography style={{ margin: 'auto 0' }} type="headline" >{messages.title}</Typography>
);

const renderRow = (partners, id, cfei, agencyId) => partners.map((partner, index) => (
  <div>
    <PaddedContent key={partner.id}>
      <SingleSelectedPartner
        key={`partner_${index}`}
        partner={partner}
        id={id}
      />
    </PaddedContent>
    {((agencyId === cfei.agency)
     || (cfei.status === PROJECT_STATUSES.COM)) &&
     <div>
       <Divider />
       <PaddedContent>
         <SingleSelectedPartnerInfo
           key={`partner_info_${index}`}
           partner={partner}
           id={id}
         />
       </PaddedContent>
     </div>
    }
  </div>
));


const SelectedPartners = (props) => {
  const { partners, id, cfei, agencyId } = props;

  return (
    <HeaderList
      header={title}
    >
      {renderRow(partners, id, cfei, agencyId)}
    </HeaderList>
  );
};

SelectedPartners.propTypes = {
  partners: PropTypes.array,
  id: PropTypes.number,
  agencyId: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const cfei = selectCfeiDetails(state, ownProps.id);
  return {
    agencyId: state.session.agencyId,
    partners: cfei ? cfei.direct_selected_partners : [],
    cfei,
  };
};

SelectedPartners.defaultProps = {
  partners: [],
};

export default connect(
  mapStateToProps,
)(SelectedPartners);
