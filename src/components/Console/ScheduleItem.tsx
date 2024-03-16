import React, { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@nextui-org/react';
import { JsBetContract } from '@/utils/wagmi/config';
import { numberWithCommas } from '@/utils/number';
import { Chip } from '@nextui-org/chip';
import { Button } from '@nextui-org/button';
import ChangeStatusModal from '@/components/Console/ChangeStatusModal';

type Props = {
  scheduleId: any;
};

type ScheduleData = {
  scheduleId: any;
  status: boolean;
  teamAId: string;
  teamARate: string;
  teamBId: string;
  teamBRate: string;
  teamWin: string;
};

const ScheduleItem: React.FC<Props> = (props) => {
  const { scheduleId } = props;
  const [scheduleIdSelect, setScheduleIdSelect] = useState(null);
  const [scheduleStatus, setScheduleStatus] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    scheduleId: 0,
    status: false,
    teamAId: '',
    teamARate: '',
    teamBId: '',
    teamBRate: '',
    teamWin: '',
  });

  const { data } = useReadContract({
    ...JsBetContract,
    functionName: 'schedules',
    args: [BigInt(scheduleId || 0)],
  });

  useEffect(() => {
    if (data) {
      convertData(data);
    }
  }, [data]);

  function convertData(data: any) {
    setScheduleData({
      scheduleId: data[0],
      status: data[1],
      teamAId: data[2],
      teamARate: data[3],
      teamBId: data[4],
      teamBRate: data[5],
      teamWin: data[6],
    });
  }

  function onClick(id: any, status: boolean) {
    setIsOpen(true);
    setScheduleIdSelect(id);
    setScheduleStatus(status);
  }

  function onClose() {
    setIsOpen(false);
    setScheduleIdSelect(null);
    setScheduleStatus(false);
  }

  return scheduleData.scheduleId.toString() !== '0' ? (
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
              Schedule : {scheduleData.scheduleId.toString()}
            </h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <ChangeStatusModal
          isOpen={isOpen}
          onClose={onClose}
          scheduleId={scheduleIdSelect}
          status={scheduleStatus}
        />
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p>Team ID: {scheduleData.teamAId.toString()}</p>
            <p>
              Rate:{' '}
              {numberWithCommas(
                Number(scheduleData.teamARate.toString()) / 100,
                false,
                2,
              )}
            </p>
          </div>
          <div className="flex items-center">
            <p>VS</p>
          </div>
          <div className="flex flex-col">
            <p>Team ID: {scheduleData.teamBId.toString()}</p>
            <p>
              Rate:{' '}
              {numberWithCommas(
                Number(scheduleData.teamBRate.toString()) / 100,
                false,
                2,
              )}
            </p>
          </div>
        </div>
      </CardBody>
      <CardFooter className="gap-3 flex justify-between">
        <div className="flex gap-1">
          Status:{' '}
          {scheduleData.status ? (
            <Chip color="primary" size="sm">
              Open
            </Chip>
          ) : (
            <Chip color="danger" size="sm">
              Close
            </Chip>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            color={scheduleData.status ? 'danger' : 'primary'}
            size="sm"
            onClick={() =>
              onClick(scheduleData.scheduleId, scheduleData.status)
            }
          >
            {scheduleData.status ? 'Close' : 'Open'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  ) : null;
};

export default ScheduleItem;
