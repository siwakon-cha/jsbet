import React, { ReactElement, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@nextui-org/button';
import CreateScheduleModal from '@/components/Console/CreateScheduleModal';
import ScheduleList from '@/components/Console/ScheduleList';
import { useAccount, useReadContract } from 'wagmi';
import { ApeTokenContract, JsBetContract } from '@/utils/wagmi/config';
import { ethers, getAddress } from 'ethers';
import { numberWithCommas } from '@/utils/number';

const Console = () => {
  const { address } = useAccount();
  const treasuryAddress = '0xeD8Dbca46663C0bA78B005e31b3EA9fFb13295F1';
  const [isOpen, setIsOpen] = useState(false);

  const { data: ownerAddress } = useReadContract({
    ...JsBetContract,
    functionName: 'owner',
  });

  const { data: balance } = useReadContract({
    ...ApeTokenContract,
    functionName: 'balanceOf',
    args: [`${treasuryAddress}`],
  });

  function onClick() {
    setIsOpen(true);
  }

  if (!address) {
    return null;
  }
  if (!ownerAddress) {
    return null;
  }

  return getAddress(address) === getAddress(ownerAddress) ? (
    <div>
      <div className="mb-2 flex justify-between">
        <div>
          Treasury:{' '}
          {balance
            ? numberWithCommas(ethers.formatUnits(balance, 'ether'), true, 2)
            : 0}
          : APE
        </div>
        <div>
          <Button color="primary" onClick={() => onClick()}>
            Create Schedule
          </Button>
          <CreateScheduleModal isOpen={isOpen} onOpenChange={setIsOpen} />
        </div>
      </div>
      <div>
        <ScheduleList />
      </div>
    </div>
  ) : (
    <div className="m-6 w-full text-center">
      <h1 className="text-3xl font-bold">Address: {address || ''}</h1>
      <p className="text-3xl font-bold">don't have permission!!!</p>
    </div>
  );
};

Console.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Console;
