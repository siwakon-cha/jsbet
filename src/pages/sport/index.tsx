import React, { ReactElement } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SportList from '@/components/Sport/SportList';

const Sport = () => {
  return (
    <div>
      <SportList />
    </div>
  );
};

Sport.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Sport;
