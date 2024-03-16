import React, { useState } from 'react';

import MybetItem from '@/components/MyBet/MybetItem';

const MybetList = () => {
  const [gameCount] = useState(50);
  return (
    <div className="grid grid-cols-4 md:grid-cols-3 gap-4">
      {Array.from({ length: gameCount }, (_, index) => {
        return <MybetItem key={index} betId={index + 1} />;
      })}
    </div>
  );
};

export default MybetList;
