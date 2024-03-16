import React, { useEffect } from 'react';
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
  onClose: any;
  scheduleId: any;
  status: boolean;
};

type FormValues = {
  teamId: string;
};

const ChangeStatusModal: React.FC<Props> = (props) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isOpen, onClose, scheduleId, status } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (status) {
        await writeContract({
          ...JsBetContract,
          functionName: 'closeSchedule',
          args: [scheduleId, values.teamId],
        });
      } else {
        await writeContract({
          ...JsBetContract,
          functionName: 'openSchedule',
          args: [scheduleId],
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('open schedule failure!');
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      onClose();
      toast.success('open schedule success!');
    }
  }, [isConfirmed]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {status ? 'Close' : 'Open'} Schedule
            </ModalHeader>
            <ModalBody>
              {status && (
                <div>
                  <Input
                    defaultValue="1"
                    label="Team ID"
                    variant="bordered"
                    {...register('teamId', {
                      required: '*Please insert Team ID',
                    })}
                  />
                  <TextError errors={errors} name="teamId" />
                </div>
              )}
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
                {isPending ? 'Confirming...' : 'Submit'}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangeStatusModal;
