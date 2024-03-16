import React, { useEffect, useState } from 'react';
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import { JsBetContract } from '@/utils/wagmi/config';
import { Button } from '@nextui-org/button';
import { numberWithCommas } from '@/utils/number';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { BaseError } from 'viem';

type Props = {
  betId: any;
};

type ScheduleData = {
  betId: any;
  address: string;
  scheduleId: string;
  teamId: string;
  amount: string;
  timestamp: string;
  fulfill: boolean;
};

const MybetItem: React.FC<Props> = (props) => {
  const { betId } = props;
  const { writeContract, data: hash, error } = useWriteContract();
  const [betData, setBetData] = useState<ScheduleData>({
    address: '',
    amount: '',
    betId: 0,
    fulfill: false,
    scheduleId: '',
    teamId: '',
    timestamp: '',
  });
  const { data } = useReadContract({
    ...JsBetContract,
    functionName: 'bets',
    args: [BigInt(betId)],
  });

  useEffect(() => {
    if (data) {
      convertData(data);
    }
  }, [data]);

  function convertData(data: any) {
    setBetData({
      betId: data[0],
      address: data[1],
      scheduleId: data[2],
      teamId: data[3],
      amount: data[4],
      timestamp: data[5],
      fulfill: data[6],
    });
  }

  async function onClick(betId: any, scheduleId: any) {
    try {
      await writeContract({
        ...JsBetContract,
        functionName: 'collectPrize',
        args: [betId, scheduleId],
      });
    } catch (err) {
      console.error(err);
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('collect prize success!');
    }
  }, [isConfirmed]);

  useEffect(() => {
    let id;
    if (isConfirming) {
      id = toast.loading('confirming...');
    }

    return () => {
      toast.dismiss(id);
    };
  }, [isConfirming]);

  useEffect(() => {
    if (error) {
      toast.error((error as BaseError).shortMessage || error.message);
    }
  }, [error]);

  return betData.betId.toString() !== '0' ? (
    <Card>
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Bet : {betData.betId.toString()}
            </h4>
            <h4 className="text-small font-semibold leading-none text-default-600">
              Schedule : {betData.scheduleId.toString()}
            </h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p>Team ID: {betData.teamId.toString()}</p>
            <p>Amount: {numberWithCommas(betData.amount.toString(), true)}</p>
            <p>
              Bet Time:{' '}
              {dayjs
                .unix(Number(betData.timestamp))
                .format('DD-MM-YYYY HH:mm:ss')}
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter className="gap-3 flex justify-between">
        {/* <div className="flex gap-1"> */}
        {/*  Collected:{' '} */}
        {/*  {betData.fulfill ? ( */}
        {/*    <Chip color="primary" size="sm"> */}
        {/*      Open */}
        {/*    </Chip> */}
        {/*  ) : ( */}
        {/*    <Chip color="danger" size="sm"> */}
        {/*      Close */}
        {/*    </Chip> */}
        {/*  )} */}
        {/* </div> */}
        <div className="flex gap-1">
          <Button
            color={betData.fulfill ? 'default' : 'primary'}
            size="sm"
            onClick={() => onClick(betData.betId, betData.scheduleId)}
            disabled={betData.fulfill}
          >
            Collect Prize
          </Button>
        </div>
      </CardFooter>
    </Card>
  ) : null;
};

export default MybetItem;
