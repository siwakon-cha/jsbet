import React from 'react';
import Header from '@/components/layout/Header';

type Props = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="m-12">{children}</div>
    </div>
  );
};

export default MainLayout;
