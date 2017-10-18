
// eslint-disable-next-line
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const withSectorType = ComposedComponent => connect(
  state => ({
    sectors: state.sectors.allSectors,
    bySector: state.sectors.bySector,
  }),
  null,
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...{
      sector: stateProps.sectors[ownProps.sectorId],
    },
  }),
)(ComposedComponent);


withSectorType.propTypes = {
  sector: PropTypes.string.isRequired,
};

export default withSectorType;

