import React from 'react';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextError from '@/components/TextError';
import { JsBetContract } from '@/utils/wagmi/config';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { BaseError } from 'viem';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  onOpenChange: any;
};

type FormValues = {
  scheduleId: string;
  teamAId: string;
  teamARate: string;
  teamBId: string;
  teamBRate: string;
};

const CreateScheduleModal: React.FC<Props> = (props) => {
  // const { address } = useAccount();
  // const { connector } = getAccount(config);
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  // const [data, setData] = useState([]);
  const { isOpen, onOpenChange } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      scheduleId: '1',
      teamAId: '1',
      teamARate: '170',
      teamBId: '3',
      teamBRate: '190',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      console.log(values);
      await writeContract({
        ...JsBetContract,
        functionName: 'createSchedule',
        args: [
          values.scheduleId,
          values.teamAId,
          values.teamARate,
          values.teamBId,
          values.teamBRate,
        ],
      });

      // console.log(result);
      onOpenChange(false);
      // toast.success('create schedule success!');
      // writeContractAsync();
    } catch (err) {
      console.error(err);
      toast.error('create schedule failure!');
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              Create Schedule
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                defaultValue="1"
                label="Schedule ID"
                variant="bordered"
                {...register('scheduleId', {
                  required: '*Please insert scheduleId',
                })}
              />
              <TextError errors={errors} name="scheduleId" />
              <Input
                defaultValue="1"
                label="Team A ID"
                variant="bordered"
                {...register('teamAId', {
                  required: '*Please insert Team A ID',
                })}
              />
              <TextError errors={errors} name="teamAId" />
              <Input
                defaultValue="170"
                label="Team A Rate eg.170 = 1.70"
                variant="bordered"
                {...register('teamARate', {
                  required: '*Please insert Team A Rate',
                })}
              />
              <TextError errors={errors} name="teamARate" />
              <Input
                defaultValue="4"
                label="Team B ID"
                variant="bordered"
                {...register('teamBId', {
                  required: '*Please insert Team B ID',
                })}
              />
              <TextError errors={errors} name="teamBId" />
              <Input
                defaultValue="190"
                label="Team B Rate eg.170 = 1.70"
                variant="bordered"
                {...register('teamBRate', {
                  required: '*Please insert Team B Rate',
                })}
              />
              <TextError errors={errors} name="teamBRate" />
              <div className="flex w-full">
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
                {error && (
                  <div className="text-red-500">
                    Error: {(error as BaseError).shortMessage || error.message}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" type="submit" disabled={isPending}>
                {isPending ? 'Confirming...' : 'Create'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateScheduleModal;
