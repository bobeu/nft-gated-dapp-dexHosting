import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material//Typography';
import Container from '@mui/material//Container';
import React from 'react';
import { useAccount } from 'wagmi';
import runContractFunc from '../../apis';
import { SignUprops } from '../../../interfaces';
import { Spinner } from '../../Spinner';
import green from '@mui/material/colors/green';

const FUNC_NAME = 'mint';

export function Mint (props: SignUprops) {
  const [ loading, setLoading ] = React.useState<boolean>(false);
  const { handleClick, setauth, isUser } = props;
  const { address, isConnected, connector } = useAccount();

  React.useEffect(() => {
    const endtask = new AbortController();
    const refetchData = async() => {
      if(connector) {
        const provider = await connector?.getProvider();
        if(isConnected) {
          if(provider) {
            const bal = await runContractFunc({
              account: address,
              providerOrSigner: provider,
              functionName: 'nftBalance'
            });
            if(bal.balanceOrAllowance.toString() > '0') {
              setauth();
            }
          }
        }
      }
    }
    refetchData();
    return () => endtask.abort();
  }, [isConnected]);

  const handleMint = async() => {
    setLoading(true);
    await handleClick(FUNC_NAME);
    setLoading(false);
  }

  return (
    <Container maxWidth={isUser ? 'xs' : 'md'}>
      <Stack>
        <Typography component='button' variant='h5' color='rgba(150, 150, 150, 0.7)'>Membership Not Found</Typography>
        <Typography component='button' variant='h5' color='rgba(150, 150, 150, 0.7)'>To interact with this Dapp, Please mint membership NFT</Typography>
        <Button
          fullWidth
          variant='contained'
          endIcon={loading? <Spinner color={'white'} /> : 'Proceed to mint'}
          onClick={handleMint}
          sx={{
            background:green[700],
            color: 'whitesmoke',
            '&:hover': {
              background: 'rgba(150, 150, 150, 0.3)',
            }
          }}
        />
      </Stack>
    </Container>
  )
}
