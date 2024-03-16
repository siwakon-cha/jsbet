import React, { ReactElement } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MybetList from '@/components/MyBet/MybetList';

const MyBet = () => {
  return (
    <div>
      <MybetList />
    </div>
  );
};

MyBet.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default MyBet;
