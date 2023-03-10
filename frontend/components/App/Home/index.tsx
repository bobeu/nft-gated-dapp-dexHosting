import React from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { ConnectKitButton } from 'connectkit';

export function Home () {
  return (
    <main >
      <Box sx={{ bgcolor: '', pt: 16, pb: 6, }}>
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h3"
            align="center"
            color="rgb(150, 150, 150)"
            gutterBottom
            mt={2}
          >
            Decentralized Token swap powered by Celo
          </Typography>
          <Typography variant="h6" align="center" color="rgba(150, 150, 150, 0.7)" paragraph>
            Exchange ERC20 compatible token for $CELO
          </Typography>
          <Typography variant="overline" align="center" color="green" paragraph>
            Built by <span style={{color: 'rgba(170, 170, 170, 0.9)'}}><a href="https://github.com/bobeu/">Isaac J.</a></span> for Celo developers - #celosage
          </Typography>
          <Typography variant='h6' component='button' color='orange' >Warning!</Typography>
          <Box sx={{display: 'flex', justifyContent: 'center', }}>
            <Typography variant='body2' component='button' color='yellowgreen'>
              This sample project is for tutorial purpose and may not be suited for production.<br/>
              It runs on Celo Alfajores. Do not use real $Celo
            </Typography>
          </Box>
          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          <ConnectKitButton />
          <Button variant="outlined">
            <Link color="rgba(150, 150, 150, 0.8)" sx={{
              '&:hover': {
                border: 'rgba(100, 100, 100, 0.5)'
              }
            }} href="https://github.com/bobeu/nft-gated-dapp-dexHosting" underline='none'>Source code</Link> 
          </Button>
        </Stack>
      </Container>
    </Box>
  </main>
  )
}
