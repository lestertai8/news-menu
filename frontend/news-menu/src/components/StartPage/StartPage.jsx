import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useEffect, useState } from 'react';
import "./StartPage.css";
import api from "../../api.js";
import Story from "../Story/Story.jsx";
import Alert from '@mui/material/Alert';

import CircularProgress from '@mui/material/CircularProgress';


// tutorial on audio in react app
// https://www.youtube.com/watch?v=U1T_J6Odoqg


function StartPage({userPersonas}) {

    const personas = [
        "Middle Schooler",
        "William Shakespeare",
        "Conspiracy Theorist",
        "Sarcastic Person"
    ]

    const [persona, setPersona] = useState("");
    const [time, setTime] = useState(0);
    const [topic, setTopic] = useState("");
    // const [text, setText] = useState("");
    const [articles, setArticles] = useState([]);
    const [unfilledAlert, setUnfilledAlert] = useState(false);
    // const [summary, setSummary] = useState("");
    // const [quiz, setQuiz] = useState("");

    // set the persona when the button is clicked
    const handleButtonPersona = (name) => {
        setPersona(name);
        // console.log(persona);
    }

    // set the time when the button is clicked
    const handleButtonTime = (minutes) => {
        setTime(minutes);
    }
    // set the topic when the button is clicked
    const handleButtonTopic = (subject) => {
        setTopic(subject);
    }

    const [buttonLoading, setButtonLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        // once something renders, we can switch back from the loading button
        if (articles.length > 0) {
            setButtonLoading(false);
            setServerError("");
        }
    }, [articles]);

    const handleSubmit = async () => {
        try {
            if (!time || !topic || !persona) {
                setUnfilledAlert(true);
                return;
            }
            else {
                setUnfilledAlert(false);
                // button begins to load
                setButtonLoading(true);
                setArticles([]);
                const res = await api.post("/articles", {category: topic, time: time, persona: persona});
                if (res.data.news.length === 0) {
                    setServerError("Could not find any articles for your selection. Try again.");
                    setButtonLoading(false);
                }
                else {
                    setArticles(res.data.news);
                    // setTime(0);
                    // setTopic("");
                    // setPersona("");
                }
                // there's now an array of articles... we can parse each article and get the text, author, etc.
                // https://stackoverflow.com/questions/69318193/how-to-use-map-in-react-to-create-multiple-component
    
    
    
                // setText("");
                // setSummary("");
                // const story = "Once there was a little piggy who lived in a house made of straw. One day, a big bad wolf came along and blew it down.";
                // const story = await api.post("/articles", {time: time});
                // setText(story.data.news.slice(0, time).join("\n\n\n")); // there is now an array of text...
                // const response = await api.post("/summary", {persona: persona, text: text});
                // setSummary(response.data.summary);
            }
        } catch (error) {
            setButtonLoading(false);
            setServerError("There was an issue retrieving your articles. Try again. Request times out after 20 seconds.");
            console.error("Error getting articles:", error);
        }
    }
    
    return (
        <div className="start-page">
            <h2>How long will your meal be?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button onClick={() => handleButtonTime(1)} style={{
                    backgroundColor: time === 1 ? "#BE5103" : "#165fc7"
                }}>Short</Button>
                {/* <Button onClick={() => handleButtonTime(2)} style={{
                    backgroundColor: time === 2 ? "#BE5103" : "#165fc7"
                }}>2 minutes</Button>
                <Button onClick={() => handleButtonTime(3)} style={{
                    backgroundColor: time === 3 ? "#BE5103" : "#165fc7"
                }}>3 minutes</Button> */}
            </ButtonGroup>
            <h2>What cuisine are you interested in?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group"
            sx={{
                gap: "10px",
            }}
            >
                <Button onClick={() => handleButtonTopic("tech")} style={{
                    backgroundColor: topic === "tech" ? "#BE5103" : "#165fc7"
                }}>Tech</Button>
                <Button onClick={() => handleButtonTopic("sports")} style={{
                    backgroundColor: topic === "sports" ? "#BE5103" : "#165fc7"
                }}>Sports</Button>
                <Button onClick={() => handleButtonTopic("science")} style={{
                    backgroundColor: topic === "science" ? "#BE5103" : "#165fc7"
                }}>Science</Button>
            </ButtonGroup>
            <h2>Who will your server be?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group"
            sx={{
                gap: "10px",
            }}
            >
                {personas.map((person, index) => (
                    <Button key={index} onClick={() => handleButtonPersona(person)} style={{
                        backgroundColor: persona === person ? "#BE5103" : "#165fc7"
                    }}>{person}</Button>
                ))}
            </ButtonGroup>
            <h2>Ready to order?</h2>
            {buttonLoading ? 
            <CircularProgress /> :
            <Button variant="contained" onClick={handleSubmit}>All ready!</Button>}
            {unfilledAlert && <Alert severity="error" className="alert">Please select a time, news topic, and persona.</Alert>}
            {serverError && <Alert severity="error" className="alert">{serverError}</Alert>}
            {/* <h2>Original Text</h2>
            <h3>{text || "no text"}</h3>
            <h2>{persona || "no one selected yet"}</h2>
            <h3>{summary || "no summary yet"}</h3> */}
            <div className="story-cards">
                {articles.map((article, index) => (
                    <Story 
                        key={index}
                        userPersonas={userPersonas}
                        title={article.title}
                        date={article.date}
                        text={article.text}
                        summary={article.summary} // not currently used in story comp
                        imageURL={article.image}
                        url={article.url}
                        source={article.source}
                        quizQuestion={article.quiz_question}
                        quizChoices={article.quiz_choices}
                        quizAnswer={article.quiz_answer}
                    />
                ))}
            </div>
        </div>
    );
}

export default StartPage;