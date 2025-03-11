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
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import { Icon } from '@mui/material';
import "./Story.css";
import api from "../../api.js";
import Divider from '@mui/material/Divider';
import ButtonGroup from '@mui/material/ButtonGroup';

// dialog imports
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubble from '../ChatBubble/ChatBubble.jsx';

import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

function ActionAreaCard( {
    userPersonas,
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

//   const personas = [
//     "Middle Schooler",
//     "William Shakespeare",
//     "Conspiracy Theorist",
//     "Sarcastic Person"
// ]

  const personas = [
    {
      name: "Middle Schooler",
      description: "Uses simple language and has limited vocabulary."
    },
    {
      name: "College Student",
      description: "Uses advanced vocabulary. Is very progressive."
    },
    {
      name: "Professor",
      description: "Uses a lot of jargon and is a very interdisciplinary thinker."
    }
  ]

  // console.log("Quiz choices: " + quizChoices);
  // console.log("Quiz answer: " + quizAnswer);

  // console.log("story retrieved user: ", user);

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
      // console.log("Correct answer");
      setCorrect("correct");
    }
    else {
      // console.log("Incorrect answer");
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

  // this is for the drawer and chats
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    if (drawerOpen) {
      setDrawerOpen(false);
    }
    else {
      setDrawerOpen(true);
    }
  }

  // const chatHistory = [
  // ]
  const [chatHistory, setChatHistory] = React.useState([]);
  // const [questionHistory, setQuestionHistory] = React.useState([]);

  // states for the chatbot
  // this will be a generated question from the /prompt endpoint (input)
  const [chatbotPrompt, setChatbotPrompt] = React.useState("");

  const [chatbotChoices, setChatbotChoices] = React.useState([]);
  const [showChoices, setShowChoices] = React.useState(false);

  // need to pass persona from StartPage eventually
  const [chatbotPersona, setChatbotPersona] = React.useState("");

  // const [chatbotResponse, setChatbotResponse] = React.useState("");

  const [fieldError, setFieldError] = React.useState(false);
  const [serverError, setServerError] = React.useState("");
  const [buttonLoading, setButtonLoading] = React.useState(false);

  // https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  const messagesEndRef = React.useRef();

  // https://stackoverflow.com/questions/67578008/how-to-get-value-from-material-ui-textfield-after-pressing-enter
  const onKeyPress = (e) => {
    if (e.key === "Enter" && !buttonLoading) {
      handleSubmitChatbot();
      e.preventDefault();
    }
    else {
      e.preventDefault();
    }
  }

  const handleSubmitChatbot = async () => {
    try {
      setButtonLoading(true);
      setServerError("");
      setFieldError(false);
      if (!chatbotPrompt || !chatbotPersona) {
        setFieldError(true);
        setButtonLoading(false);
        return;
    }
      // setChatbotChoices([]);
      console.log("Prompt: ", chatbotPrompt);
      const res = await api.post("/chat", {
        context: text,
        chat_history: chatHistory.slice(-10).map(message => ({
          role: message.role,
          content: message.content
        })), 
        new_persona: chatbotPersona.name, 
        new_persona_description: chatbotPersona.description,
        input: chatbotPrompt});
      // setChatbotResponse(res.data.parsed);
      // chatHistory.push(res.data.raw);
      // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
      if (res.data) {
        setChatbotChoices([]);
        setButtonLoading(false);
      }
      setChatHistory(prevChatHistory => [...prevChatHistory, 
        { role: "user", content: chatbotPrompt, persona: "user" },
        { role: "assistant", content: res.data.parsed, persona: chatbotPersona.name }
      ]);
      console.log("Chat History array: ", chatHistory);
      console.log("Chatbot History length: ", chatHistory.length);
      console.log(res.data.parsed);
      setChatbotPrompt("");
      setButtonLoading(false);
      }
    catch (error) {
      setButtonLoading(false);
      console.error("Error submitting chatbot response:", error);
      setServerError("Error submitting chatbot response. Try again.");
    }
  }

  React.useEffect(() => {
    async function generatePrompt() {
      try {
        const res = await api.post("/prompt", {
          context: summary,
          chat_history: chatHistory.slice(-10).map(message => ({
            role: message.role,
            content: message.content
          })), 
        });
        setChatbotChoices(res.data.prompts);
        console.log("Chatbot choices: ", res.data.prompts);
      }
      catch (error) {
        console.error("Error getting prompts: ", error);
      }
    }
    async function scrollToBottom() {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth",
        block: "center"
       });
    }
    generatePrompt();
    scrollToBottom();
  }, [chatHistory]);

  // const generatePrompt = async () => {
  //   try {
  //     const res = await api.post("/prompt", {
  //       context: summary,
  //       chat_history: chatHistory.slice(-10).map(message => ({
  //         role: message.role,
  //         content: message.content
  //       })), 
  //     });
  //     setChatbotChoices(res.data.prompts);
  //     console.log("Chatbot choices: ", res.data.prompts);
  //   }
  //   catch (error) {
  //     console.error("Error getting prompts: ", error);
  //   }
  // }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row'
      }}>
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
              <Typography gutterBottom variant="h5" component="div" 
              sx={{ 
                textAlign: 'left',
                whiteSpace: 'pre-line',
                }}>
                {!showSummary ? "Original Article" : `AI-Summarized Article`}
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
              <Box>
              <IconButton onClick={handleClickOpen}>
                <QuizIcon/>
              </IconButton>
              <IconButton onClick={handleDrawerOpen}>
                <ForumIcon/>
              </IconButton>
              </Box>
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

      {/* Chatbot */}
        {drawerOpen && (

        <Box
          sx={{
            width: 400,
            minWidth: "400px",
            backgroundColor: "bisque",
            color: "black",
          }}>
            <Card 
            sx={{
              width: "100%"
            }}>
              <CardHeader
              sx={{
                '& .MuiCardHeader-title': {
                  fontFamily: "Times New Roman",
                  fontSize: "30px",
                  fontWeight: "bold",
              }}}
                title="Roundtable Talk"
                subheader="Welcome in!"
                />
              <Box
                sx={{
                  // maxHeight: "400px",
                  overflowY: "auto",
                  maxHeight: "60vh",
                  backgroundColor: "bisque",
                  marginTop: "10px",
                  paddingTop: "30px",
                }}
                >
                {chatHistory.map((message, index) => (
                  <ChatBubble key={index} message={message.content} persona={message.persona} />
                ))}
                <div ref={messagesEndRef}></div>
                </Box>
                {fieldError && <Alert severity="error" className="alert">Please select a persona and prompt.</Alert>}
                {serverError && <Alert severity="error" className="alert">{serverError}</Alert>}
              <Box>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Ask a question!
                </Typography>
                <TextField
                  inputProps={{
                    maxLength: 300
                  }}
                  onChange={(e) => setChatbotPrompt(e.target.value)}
                  value={chatbotPrompt}
                  multiline
                  onFocus={() => setShowChoices(true)}
                  onBlur={() => setShowChoices(false)}
                  onKeyPress={onKeyPress}
                  sx={{
                    borderRadius: '5px',
                    width: "90%",
                  }}
                  />
                {showChoices && chatbotChoices && chatbotChoices.length > 0 && (
                //   <ButtonGroup variant="contained" aria-label="Basic button group"
                //   disableElevation
                //   sx={{
                //     padding: "10px",
                //     margin: "10px",
                //     display: "flex",
                //     justifyContent: "center",
                //   }}
                //   >
                //   {chatbotChoices.map((choice, index) => (
                //     <Button key={index} onClick={() => setChatbotPrompt(choice)} style={{
                //       // backgroundColor: chatbotPrompt === choice ? "#BE5103" : "#165fc7",
                //       backgroundColor: "#165fc7",
                //       textTransform: "none",
                //     }}>{choice}</Button>
                //   ))}
                // </ButtonGroup>
                <List>
                  {chatbotChoices.map((choice, index) => (
                    <ListItem>
                      {/* have to use mousedown here or else textfield cries about it */}
                      <ListItemButton key={index} onMouseDown={() => setChatbotPrompt(choice)} sx={{
                        fontSize: "14px",
                        color: "gray",
                        border: "1px solid gray",
                        borderRadius: "10px",
                        // backgroundColor: chatbotPrompt === choice ? "#BE5103" : "#165fc7",
                        // backgroundColor: "#165fc7",
                        // textTransform: "none",
                      }}>{choice}</ListItemButton>
                    </ListItem>
                  ))}
                </List>
                )}
              </Box>

              <Box>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Who will answer?
                </Typography>
                <ButtonGroup variant="contained" aria-label="Basic button group"
                disableElevation
                sx={{
                  padding: "10px",
                  margin: "10px",
                  gap: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
                >
                  {personas.map((person, index) => (
                    <Button key={index} onMouseDown={() => setChatbotPersona(person)} style={{
                      backgroundColor: chatbotPersona.name === person.name ? "#BE5103" : "#165fc7"
                    }}>{person.name}</Button>
                  ))}
                </ButtonGroup>

                <Typography gutterBottom variant="h6" sx={{ textAlign: "center" }}>
                  Your custom personas!
                </Typography>
                <ButtonGroup variant="contained" aria-label="Basic button group"
                disableElevation
                sx={{
                  padding: "10px",
                  margin: "10px",
                  gap: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
                >
                  {userPersonas.map((person, index) => (
                    <Button key={index} onMouseDown={() => setChatbotPersona(person)} style={{
                      backgroundColor: chatbotPersona.name === person.name ? "#BE5103" : "#165fc7"
                    }}>{person.name}</Button>
                  ))}
                </ButtonGroup>
                </Box>

              {/* <Button onClick={handleSubmitChatbot}>
                Submit Inquiry
              </Button> */}
              {/* {buttonLoading ? 
            <CircularProgress /> :
            <Button variant="contained" onClick={handleSubmit}>All ready!</Button>} */}
              {buttonLoading ?
              <CircularProgress /> : 
              <IconButton onMouseDown={handleSubmitChatbot}>
                <SendIcon/>
              </IconButton> }
            </Card>
          <Divider
          />
        </Box>

        )}
    </Box>
  );
}

export default ActionAreaCard;