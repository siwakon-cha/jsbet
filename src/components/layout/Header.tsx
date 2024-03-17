import React from 'react';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ApeTokenContract } from '@/utils/wagmi/config';
import { useAccount, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import { numberWithCommas } from '@/utils/number';

const Header = () => {
  const { address } = useAccount();
  const router = useRouter();
  const { data: balance } = useReadContract({
    ...ApeTokenContract,
    functionName: 'balanceOf',
    args: [`${address}`],
  });

  function checkActive(path: string) {
    return router.pathname === path;
  }

  return (
    <Navbar position="static">
      <NavbarBrand className="cursor-pointer" onClick={() => router.push('/')}>
        <p className="font-bold text-inherit">FiRoll</p>
      </NavbarBrand>
      <NavbarContent className="flex gap-4" justify="center">
        <NavbarItem isActive={checkActive('/sport')}>
          <Link
            color={checkActive('/sport') ? 'primary' : 'foreground'}
            href="/sport"
          >
            Sport
          </Link>
        </NavbarItem>
        <NavbarItem isActive={checkActive('/my-bet')}>
          <Link
            color={checkActive('/my-bet') ? 'primary' : 'foreground'}
            href="/my-bet"
          >
            My Bet
          </Link>
        </NavbarItem>
        <NavbarItem isActive={checkActive('/console')}>
          <Link
            color={checkActive('/console') ? 'primary' : 'foreground'}
            href="/console"
          >
            Console
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {balance
            ? numberWithCommas(ethers.formatUnits(balance, 'ether'), true, 2)
            : 0}
          : APE
        </NavbarItem>
        <NavbarItem>
          <ConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
