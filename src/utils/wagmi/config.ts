import { http, createConfig } from '@wagmi/core';
import { spicy } from '@wagmi/core/chains';
import { apeTokenAbi } from '@/lib/abi/apeTokenAbi';
import { JsBetAbi } from '@/lib/abi/JsBetAbi';
import { injected } from '@wagmi/connectors';

export const config = createConfig({
  chains: [spicy],
  transports: {
    [spicy.id]: http(),
  },
  connectors: [injected()],
});

export const ApeTokenContract = {
  address: '0x5218d83bE44f84D54284DA6c521C88aa908B290d',
  abi: apeTokenAbi,
} as const;

export const JsBetContract = {
  address: '0x5AD6306f78a3692988208bbEA79988D4CeB5a6AC',
  abi: JsBetAbi,
} as const;
