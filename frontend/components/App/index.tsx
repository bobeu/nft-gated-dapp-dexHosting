import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ConnectKitButton } from 'connectkit';
import { CardComponent } from './CardComponent';
import { Spinner } from '../Spinner';
import runContractFunc from '../apis';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { getEllipsisTxt } from '../helpers/formatters';
import { Data, data as data_1, Result } from '../../interfaces';
import green from '@mui/material/colors/green';
import getContractData from '../apis/contractdata';
import { Home } from './Home';
import { AppProtected } from './AppProtected';
import { useBalance, useAccount } from 'wagmi';

const theme = createTheme();

export default function App() {
  const [isUser, setAuth] = React.useState(false);
  const { memberAddr } = getContractData();
  const { address, connector, isConnected } = useAccount();
  const { data, isFetched, refetch } = useBalance({
    address: address,
    token: `0x${memberAddr.replace('0x', '')}`,
    formatUnits: 'ether'
  });

  React.useEffect(() => {
    const abortOp = new AbortController();
    const getBalance = async() => {
      const bal = isFetched ? data : await (await refetch({ exact: true })).data;
      bal?.formatted && bal?.formatted  > '1' && setAuth(true);
      console.log("Bal", bal);
    }

    getBalance();

    return () => abortOp.abort()
  }, [address, connector, isFetched])


  return (
    <ThemeProvider theme={theme}>
      { isConnected? <AppProtected /> : <Home /> }
    </ThemeProvider>
  )
}


