import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

function Step({ number, instruction }) {
  return (
    <Box
        sx={{
            display: 'flex',
            width: 'fit-content',
            border: '1px solid gray',
            boxShadow: '10px 5px 5px black',
            padding: '10px',
            paddingRight: '120px',
            borderRadius: '20px',
            backgroundColor: '#f0f1f6',
            marginBottom: '35px',
            marginTop: '35px',
        }}
    >
        <Chip
        sx={{
            backgroundColor: '#0084f5',
            borderRadius: '50%',
            color: 'white',
        }}
        label={number}
        />
        <Typography sx={{
            color: 'black',
            fontSize: '20px',
            marginLeft: '10px',
        }}>
            {instruction}
        </Typography>
    </Box>
  );
}

export default Step;