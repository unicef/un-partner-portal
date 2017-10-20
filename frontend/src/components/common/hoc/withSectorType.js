
// eslint-disable-next-line
import R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const withSectorType = ComposedComponent => connect(
  (state, ownProps) => ({
    sector: state.sectors.allSectors[ownProps.sectorId],
  }),
)(ComposedComponent);


withSectorType.propTypes = {
  sector: PropTypes.string.isRequired,
};

export default withSectorType;

