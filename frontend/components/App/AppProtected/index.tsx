import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CardComponent } from '../CardComponent';
import { Spinner } from '../../Spinner';
import runContractFunc from '../../apis';
import { useAccount, useBalance } from 'wagmi';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { getEllipsisTxt } from '../../helpers/formatters';
import { Data, data as data_1, Result } from '../../../interfaces';
import green from '@mui/material/colors/green';
import getContractData from '../../apis/contractdata';
import { Mint } from '../Mint';
import orange from '@mui/material/colors/orange';

export function AppProtected () {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isUser, setAuth] = React.useState<boolean>(false);
  const [amount, setAmount] = React.useState<number>(0);
  const [value, setValue] = React.useState<string>('0');
  const [allowance, setAllowance] = React.useState<BigNumber>(BigNumber(0));
  const [balance, setBalance] = React.useState<any>();
  const [errorMessage, setError] = React.useState<any>("");
  const [contractData, setData] = React.useState<Data>(data_1);

  const setauth = () => setAuth(true);
  const { testAddr } = getContractData();
  const { address, connector } = useAccount();
  const { data, isFetched, refetch } = useBalance({
    address: address,
    token: `0x${testAddr.replace('0x', '')}`,
    formatUnits: 'ether'
  })

  const getOpacity = () => {
    return isUser? 1 : 0
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setAmount(Number(e.target.value));
  };

  const afterTrx = (x:string, result: Result) => {
    switch (x) {
      case 'swap':
        setData(result.data);
        setAllowance(result.balanceOrAllowance);
        break;
      case 'approve':
        setAllowance(result.balanceOrAllowance);
        break;
      case 'clearAllowance':
        setAllowance(result.balanceOrAllowance);
        break;
      case 'addLiquidity':
        setData(result.data);
        break;
      case 'removeLiquidity':
        setData(result.data);
        break;
      case 'mint':
        if(result.balanceOrAllowance.toString() > '0') setauth();
        break;
      default:
        setData(result.data);
        break;
    }      
  }

  React.useEffect(() => {
    const abortOp = new AbortController();
    const getBalance = async() => {
      var funcName = 'getBalance';
      const provider = await connector?.getProvider();
      if(provider) {
        const result = await runContractFunc({
          providerOrSigner: provider,
          functionName: funcName,
          account: address
        });
        afterTrx(funcName, result);
      }

      const bal = isFetched ? data : await (await refetch({ exact: true })).data;
      setBalance(bal?.formatted);
    }

    getBalance();

    return () => abortOp.abort()
  }, [errorMessage, address, connector, isFetched])
  
  const handleClick = async(functionName: string, flag?:boolean) => {
    if(flag && functionName !== 'approve' && amount === 0) return alert('Please enter amount');
    if(functionName === 'addLiquidity') {
      if(value === '0') return alert('Please set value');
    }
    setLoading(true);
    const provider = await connector?.getProvider();
    
    try {
      const amt = BigNumber(amount);
      let val = ethers.utils.parseEther(value);
      if(functionName === 'swap') val = ethers.utils.parseEther('0.0001');
      if(functionName === 'mint') val = ethers.utils.parseEther('0.01');
      console.log("Val", val.toString())
      const result = await runContractFunc({
        functionName: functionName,
        providerOrSigner: provider,
        amount: ethers.utils.hexValue(ethers.utils.parseUnits(amt.toString())),
        cancelLoading: () => setLoading(false),
        account: address,
        value: val
      });
      if(functionName === 'mint') setAuth(true);
      afterTrx(functionName, result);
   
    } catch (error: any) {
      if(error) {
        const result = await runContractFunc({
          functionName: 'getData',
          providerOrSigner: provider,
        })
        afterTrx('getData', result);
        setError(error?.reason || error?.data.message || error?.message);
        setLoading(false);
        console.log("Error1", error?.reason|| error?.message || error?.data.message);
      }
    }
  }

  return (
    <main>
      <Container sx={{ p: 2, mt: 6 }} maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <Typography variant='button' component='button' color={orange[500]}>
                Warning! This sample project is for tutorial purpose and may not be suited for production.<br/>
                It runs on Celo Alfajores. Do not use real $Celo
              </Typography>
            </Box>
          </Grid>
        
          {
            !isUser? <Grid item xs={isUser? 3 : 12}>
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Mint handleClick={handleClick} setauth={setauth} isUser={isUser} />
              </Box>
            </Grid> : <Grid item container xs={12} spacing={2}>
              <Grid item xs={isUser ? 6 : 0} sx={{color: 'rgba(150, 150, 150, 0.7)'}}>
                <Container sx={{ p: 2 }} maxWidth="md">
                  <Stack sx={{opacity: getOpacity()}} >
                    <Typography variant='h5' component='button' mt={4} mb={4}>Contract state</Typography>
                    <Button startIcon={'Total Liquidity'} sx={{color: green[700]}} endIcon={contractData?._totalLiquidity.toString()} variant={'text'} />
                    <Button startIcon={'Swap Fee'} sx={{color: green[700]}} endIcon={contractData?._swapfee.toString()} variant={'text'} />
                    <Button startIcon={'Generated fee'} sx={{color: green[700]}} endIcon={contractData?._totalFeeReceived.toString()} variant={'text'} />
                    <Button startIcon={'Providers'} sx={{color: green[700]}} endIcon={contractData?._totalProvider.toString()} variant={'text'} />
                  </Stack>
                </Container> 
              </Grid>

              <Grid item xs={isUser ? 6 : 0} sx={{color: 'rgba(150, 150, 150, 0.7)'}}>
                <Container sx={{ p: 2 }} maxWidth="md">
                  <Stack sx={{opacity: getOpacity()}}>
                    <Typography variant='h5' component='button' mt={4} mb={4}>Provider profile</Typography>
                    <Button startIcon={'Amount ($CELO)'} sx={{color: green[700]}} endIcon={format(contractData?._provider.amount)} variant={'text'} />
                    <Button startIcon={'Date'} sx={{color: green[700]}} endIcon={convertFromEpoch(contractData?._provider.timeProvided)} variant={'text'} />
                    <Button startIcon={'Position'}sx={{color: green[700]}} endIcon={contractData?._provider.position.toString()} variant={'text'} />
                    <Button startIcon={'Exist ?'} sx={{color: green[700]}} endIcon={contractData?._provider.isExist? 'Yes' : 'No' } variant={'text'} />
                  </Stack>
                </Container>
              </Grid>
            </Grid>
          }
          <Grid item xs={12} sx={{opacity: getOpacity()}}>
            <Container sx={{ p: 2 }} maxWidth="md" color='rgba(150, 150, 150, 0.5)'>
              <Box 
                sx={{
                  color: 'rgba(150, 150, 150, 0.5)',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}
              >
                <Typography component={'button'} >Notification:</Typography>
                <Typography component={'button'} >{errorMessage}</Typography>
              </Box>
            </Container>
          </Grid>
          <Grid item xs={12} md={6}>
            <CardComponent
              step='Step 1'
              heading='Self Drop'
              isButton_1_display={true}
              isButton_2_display={true}
              isButton_3_display={true}
              button_1_start="Step1"
              button_2_start="Step2"
              button_1_name={'Claim SelfDrop'}
              button_2_name={'Add Liquidity'}
              button_3_name={'Remove Liquidity'}
              disableButton_1={!isUser}
              disableButton_2={!isUser}
              disableButton_3={!isUser}
              handleButton_1_Click={() => handleClick('claim')}
              handleButton_2_Click={() => handleClick('addLiquidity')}
              handleButton_3_Click={() => handleClick('removeLiquidity')}
              displayChild={loading}
              displayTextfield={true}
              handleTextfieldChange={handleValueChange}
              description={`Test balance: ${balance} ${data?.symbol}`}
            >
              <Spinner color={'white'} />
            </CardComponent>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <CardComponent
              step='Step 2'
              heading='Set Approval'
              isButton_1_display={true}
              isButton_2_display={true}
              isButton_3_display={true}
              button_1_start='Step3'
              button_2_start='Step4'
              button_1_name={'Set Approval'}
              button_2_name={'Swap Asset'}
              button_3_name={'Split Fee - Providers'}
              disableButton_1={!isUser}
              disableButton_2={!isUser}
              disableButton_3={!isUser}
              handleButton_1_Click={() => handleClick('approve', true)}
              handleButton_2_Click={() => handleClick('swap')}
              handleButton_3_Click={() => handleClick('split')}
              displayChild={loading}
              displayTextfield={true}
              handleTextfieldChange={handleAmountChange}
              description={
                `Allowance: ${allowance.toString() > '0' ? allowance.toString() : '0.00'}`
              }
            >
              <Spinner color={'white'} />
            </CardComponent>
          </Grid>
        </Grid>
      </Container>
    </main>
  )
}

const format = (x:BigNumber) => getEllipsisTxt(x.toString(), 4);

function convertFromEpoch(onchainUnixTime:BigNumber) {
  const toNumber = onchainUnixTime? onchainUnixTime.toNumber() : 0;
  var newDate = new Date(toNumber * 1000);
  return `${newDate.toLocaleDateString("en-GB")} ${newDate.toLocaleTimeString("en-US")}`;
}