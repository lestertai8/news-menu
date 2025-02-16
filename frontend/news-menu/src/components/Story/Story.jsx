import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';
import QuizIcon from '@mui/icons-material/Quiz';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { Icon } from '@mui/material';
import "./Story.css";
import api from "../../api.js";

// dialog imports
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';

function ActionAreaCard( {
    title,
    date,
    text,
    summary,
    imageURL,
    url,
    source,
    quizQuestion,
    quizChoices,
    quizAnswer
}) {

  // console.log("Quiz choices: " + quizChoices);
  console.log("Quiz answer: " + quizAnswer);

  // this determines if the summary is shown as opposed to the original text
  const [showSummary, setShowSummary] = React.useState(true);

  const handleClickText = () => {
    setShowSummary(!showSummary);
    // console.log(showSummary);
  }

  // this is for the quiz (Customization example from Google MUI: https://mui.com/material-ui/react-dialog/?srsltid=AfmBOooOrBhRZVvwd4PBTdl6knq1k646HC1PlcMXUQFrsG08r4jpZUk9)
  const [open, setOpen] = React.useState(false);
  const [choice, setChoice] = React.useState("");
  const [correct, setCorrect] = React.useState("");

  const handleButtonChoice = (option) => {
    setChoice(option);
    // console.log("Selected: " + option);
  }

  // lets handle quiz answers after clicking "Submit answer"
  const handleQuizAnswer = (answer) => {
    if (answer == quizAnswer) {
      console.log("Correct answer");
      setCorrect("correct");
    }
    else {
      console.log("Incorrect answer");
      setCorrect("incorrect");
    }
  }
  
  // this is for the audio
  const [running, setRunning] = React.useState(false);
  
  // ChatGPT suggests making the audio file its own state. Prompt: how do i pause playing audio using react?
  // setAudio will be used after stories are retrieved and summarized by openai
  // api.post("/tts", {text: summary});

  const [audio, setAudio] = React.useState(new Audio('./speech.mp3'));

  // also for the quiz popup
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };



  // how to play audio: https://stackoverflow.com/questions/9419263/how-to-play-audio
  const handleAudio = () => {
    if (!running) {
      audio.play();
      // audio.loop = true;
    }
    else {
      audio.pause();
    }
    setRunning(!running);
  }


  return (
    <Card className="newspaper-card">
        <CardHeader
          title={title}
          subheader={Date(date)}
          action={
            <IconButton onClick={handleAudio}>
              <RecordVoiceOverIcon />
            </IconButton>
          }
          sx={{ textAlign: 'center' }}
        />
        <CardMedia
          component="img"
          height="500"
          image={imageURL}
          alt="There should be a media image here..."
        />

        <CardActionArea onClick={handleClickText}>
          <CardContent className="story-card">
            <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'left' }}>
              {!showSummary ? "Original Article" : "AI-Summarized Article"}
              <br/>
              <br/>
              {!showSummary ? text : summary}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'left' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {source}
              </Typography>
              <a href={url}>
                <IconButton>
                  <LinkIcon/>
                </IconButton>
              </a>
            </Box>
            <IconButton onClick={handleClickOpen}>
              <QuizIcon/>
            </IconButton>
          </Box>
        </CardContent>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Quick Quiz
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
            <Typography gutterBottom>
              {quizQuestion}
            </Typography>
            {/* <Typography gutterBottom>
              Springfield
            </Typography>
            <Typography gutterBottom>
              Cleveland
            </Typography> */}
            <Button onClick={() => handleButtonChoice("A")}>{quizChoices[0]}</Button>
            <Button onClick={() => handleButtonChoice("B")}>{quizChoices[1]}</Button>
            <Button onClick={() => handleButtonChoice("C")}>{quizChoices[2]}</Button>
            <Typography gutterBottom>
              {/* if ? then : elif ? then : else */}
              {correct==="correct" ? "Correct!" : correct==="incorrect" ? "Incorrect!": ""}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => handleQuizAnswer(choice)}>
              Submit answer
            </Button>
          </DialogActions>

      </Dialog>

    </Card>
  );
}

export default ActionAreaCard;