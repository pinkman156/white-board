import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles,Button,Box} from '@material-ui/core';
import '../board.css'
import { SocketContext } from '../SocketContext';
import { PhoneDisabled } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
    backgroundColor:'black',
    color:"white"
  },
}));



const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call,leaveCall,show } = useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid direction="column">
    <Grid container className={classes.gridContainer}>
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{name || 'You'}</Typography>
            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
            
          
          </Grid>

         
        </Paper>
      )}
            
           
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography  variant="h5" gutterBottom>{call.name || 'Caller'}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.video} />

          </Grid>
        </Paper>
        
      )}
      
      
        
    </Grid>
    <Box textAlign='center' marginBottom="5%">

    {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} onClick={leaveCall} className={classes.margin}>
                  Hang Up
                </Button>
              ) : (<div></div>)}
              </Box>
    <Box textAlign='center' marginBottom="3%">
      <Button id="btn" variant="contained" color="secondary" onClick={show}>Show WhiteBoard</Button>
    </Box>

    <div className="sketch" id="sketch">
    <canvas className="board" id="board"></canvas>
    </div>
  </Grid>
  );
};

export default VideoPlayer;