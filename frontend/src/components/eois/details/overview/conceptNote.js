import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import HeaderList from '../../../common/list/headerList';
import FileDownloadButton from '../../../common/buttons/fileDownloadButton';
import { formatDateForPrint } from '../../../../helpers/dates';
import Loader from '../../../common/loader';
import PaddedContent from '../../../common/paddedContent';
import GridColumn from '../../../common/grid/gridColumn';

const messages = {
  caption: 'Submission Date',
};

const ConceptNote = (props) => {
  const { conceptNote, date, title, loading } = props;
  return (
    <HeaderList
      header={<Typography type="headline" >{title}</Typography>}
      rows={[
        <PaddedContent>
          <Loader loading={loading}>
            {!loading && <GridColumn align="center">
              <FileDownloadButton fileUrl={conceptNote} />
              {date && <Typography type="caption">
                {`${messages.caption}: ${formatDateForPrint(date)}`}
              </Typography>}
            </GridColumn>}
          </Loader>
        </PaddedContent>,

      ]}
    />
  );
};

ConceptNote.propTypes = {
  conceptNote: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
};

export default ConceptNote;

