import React, { useState } from 'react';

import ScheduleItem from '@/components/Console/ScheduleItem';

const ScheduleList = () => {
  const [gameCount] = useState(50);
  return (
    <div className="grid grid-cols-4 md:grid-cols-3 gap-4">
      {Array.from({ length: gameCount }, (_, index) => {
        return <ScheduleItem key={index} scheduleId={index + 1} />;
      })}
    </div>
  );
};

export default ScheduleList;
