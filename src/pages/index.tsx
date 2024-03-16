import React, { ReactElement } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-[112px] font-bold">Welcome to Web3</h1>
        <h1 className="text-[90px] font-bold">Sport Bet</h1>
        <Button color="primary" onClick={() => router.push('/sport')}>
          BET NOW
        </Button>
      </div>
    </div>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Index;
