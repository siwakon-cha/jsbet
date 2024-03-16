import React, { useState } from 'react';

import SportItem from '@/components/Sport/SportItem';

const SportList = () => {
  const [gameCount] = useState(50);
  return (
    <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: gameCount }, (_, index) => {
        return <SportItem key={index} scheduleId={index + 1} />;
      })}
    </div>
  );
};

export default SportList;
