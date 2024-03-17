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
import { ApeTokenContract, JsBetContract } from '@/utils/wagmi/config';
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { BaseError } from 'viem';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

type Props = {
  isOpen: boolean;
  onClose: any;
  scheduleId: any;
};

type FormValues = {
  amount: string;
  teamId: string;
};

const CreateBetModal: React.FC<Props> = (props) => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isOpen, onClose, scheduleId } = props;
  const { address } = useAccount();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { data: betIds } = useReadContract({
    ...JsBetContract,
    functionName: 'getBetIds',
  });

  const { data: apeBalance } = useReadContract({
    ...ApeTokenContract,
    functionName: 'balanceOf',
    args: [`${address}`],
  });

  const { data: allowance } = useReadContract({
    ...ApeTokenContract,
    functionName: 'allowance',
    args: [`${address}`, `${JsBetContract.address}`],
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const betId = betIds.length + 1;
      await writeContract({
        ...JsBetContract,
        functionName: 'createBet',
        args: [betId, scheduleId, values.amount, values.teamId],
      });

      // console.log(result);
      // onClose();
      // toast.success('create schedule success!');
      // writeContractAsync();
    } catch (err) {
      console.error(err);
      toast.error('transaction failure!');
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      onClose();
      toast.success('transaction success!');
    }
  }, [isConfirmed]);

  async function onClick() {
    try {
      const amount = watch('amount');
      await writeContract({
        ...ApeTokenContract,
        functionName: 'approve',
        args: [`${JsBetContract.address}`, ethers.parseEther(amount)],
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">Place Bet</ModalHeader>
            <ModalBody>
              <Input
                defaultValue="1"
                label="Team ID"
                variant="bordered"
                {...register('teamId', {
                  required: '*Please insert Team ID',
                })}
              />
              <TextError errors={errors} name="teamId" />
              <Input
                defaultValue="50"
                label="Amount"
                variant="bordered"
                {...register('amount', {
                  required: '*Please insert Amount',
                })}
              />
              <TextError errors={errors} name="amount" />
              <div className="flex w-full">
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
                {error && (
                  <div className="text-red-500">
                    Error: {(error as BaseError).message || error.message}
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              {apeBalance &&
              Number(ethers.formatUnits(apeBalance, 'ether')) > 0 ? (
                Number(ethers.formatUnits(allowance, 'ether')) > 0 ? (
                  <Button color="primary" type="submit" disabled={isPending}>
                    {isPending ? 'Confirming...' : 'Bet'}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={() => onClick()}
                    disabled={isPending}
                  >
                    {isPending ? 'Confirming...' : 'Approve'}
                  </Button>
                )
              ) : (
                <Button color="primary" disabled={true}>
                  Insufficient funds
                </Button>
              )}
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateBetModal;
