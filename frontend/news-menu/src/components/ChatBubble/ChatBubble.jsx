import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function ChatBubble({ message, persona }) {
    // adding multiple styles: https://stackoverflow.com/questions/69234095/change-the-style-of-individual-element-in-react-component-which-return-multiple

    const personaCSS = {
        "Middle Schooler": {
            backgroundColor: 'green',
            color: 'white',
            alignSelf: 'flex-start',
        },
        "Professor": {
            backgroundColor: 'black',
            color: 'white',
            alignSelf: 'flex-start',
        },
        "College Student": {
            backgroundColor: 'orange',
            color: 'white',
            alignSelf: 'flex-start',
        },
        "user": {
            backgroundColor: 'purple',
            color: 'white',
            alignSelf: 'flex-end',
        }
    };
  return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            {/* sender caption*/}
            {persona !== "user" && (<Typography variant="caption"
            sx={{
                fontWeight: 'bold',
                color: 'gray',
                fontSize: '11px',
                marginLeft: '10px',
                marginRight: '10px',
                // alignSelf: persona==="user" ? 'flex-end' : 'flex-start',
            }}
            >{ persona }</Typography>)}
            {/* chatbubble */}
            <Paper 
            sx={{
                // backgroundColor: '#AC90E6',
                // color: 'white',
                ...personaCSS[persona],
                fontFamily: 'Arial',
                borderRadius: '10px',
                padding: '12px',
                marginLeft: '10px',
                marginRight: '10px',
                marginBottom: '10px',
                maxWidth: '80%',
                // alignSelf: 'flex-start',
                textAlign: 'left',
                }}
            >
            {message}
            </Paper>
        </Box>
  );
}

export default ChatBubble;