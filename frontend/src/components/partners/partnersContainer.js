import React from 'react';
import MaterialGrid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { Grid, TableView, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import MainContentWrapper from '../../components/common/mainContentWrapper';
import HeaderNavigation from '../../components/common/headerNavigation';


const messages = {
  header: 'Partners',
};

const hgProfileMockData = {
  users: 25, update: '01 Jan 2016',
};

const PartnerContainer = () => (
  <div>
    <MaterialGrid item>
      <HeaderNavigation title={messages.header} />
    </MaterialGrid>
    <MainContentWrapper>
      <MaterialGrid container direction="column" gutter={40}>
        <MaterialGrid item>
          <Grid
    rows={[
      { id: 0, product: 'DevExtreme', owner: 'DevExpress' },
      { id: 1, product: 'DevExtreme Reactive', owner: 'DevExpress' },
    ]}
    columns={[
      { name: 'id', title: 'ID' },
      { name: 'product', title: 'Product' },
      { name: 'owner', title: 'Owner' },
    ]}>
    <TableView />
    <TableHeaderRow />
  </Grid>
        </MaterialGrid>
      </MaterialGrid>
    </MainContentWrapper>
  </div>
);

export default PartnerContainer;
