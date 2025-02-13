import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';
import "./StartPage.css";
import api from "../../api.js";
import Story from "../Story/Story.jsx";


// tutorial on audio in react app
// https://www.youtube.com/watch?v=U1T_J6Odoqg


function StartPage() {
    const [persona, setPersona] = useState("");
    const [time, setTime] = useState(0);
    const [topic, setTopic] = useState("");
    // const [text, setText] = useState("");
    const [articles, setArticles] = useState([]);
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

    const handleSubmit = async () => {
        try {
            setArticles([]);
            const res = await api.post("/articles", {category: topic, time: time, persona: persona});
            setArticles(res.data.news);
            // there's now an array of articles... we can parse each article and get the text, author, etc.
            // https://stackoverflow.com/questions/69318193/how-to-use-map-in-react-to-create-multiple-component



            // setText("");
            // setSummary("");
            // const story = "Once there was a little piggy who lived in a house made of straw. One day, a big bad wolf came along and blew it down.";
            // const story = await api.post("/articles", {time: time});
            // setText(story.data.news.slice(0, time).join("\n\n\n")); // there is now an array of text...
            // const response = await api.post("/summary", {persona: persona, text: text});
            // setSummary(response.data.summary);
        } catch (error) {
            console.error("Error getting articles:", error);
        }
    }
    
    return (
        <div className="start-page">
            <h2>How long will your meal be?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button onClick={() => handleButtonTime(1)}>1 minute</Button>
                <Button onClick={() => handleButtonTime(2)}>2 minutes</Button>
                <Button onClick={() => handleButtonTime(3)}>3 minutes</Button>
            </ButtonGroup>
            <h2>What cuisine are you interested in?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button onClick={() => handleButtonTopic("tech")}>Tech</Button>
                <Button onClick={() => handleButtonTopic("sports")}>Sports</Button>
                <Button onClick={() => handleButtonTopic("food")}>Food</Button>
            </ButtonGroup>
            <h2>Who will your server be?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                {/* Source: used ChatGPT to generate some examples of personas */}
                <Button onClick={() => handleButtonPersona("Middle Schooler")}>Middle Schooler</Button>
                <Button onClick={() => handleButtonPersona("William Shakespeare")}>William Shakespeare</Button>
                <Button onClick={() => handleButtonPersona("Conspiracy Theorist")}>Conspiracy Theorist</Button>
                <Button onClick={() => handleButtonPersona("Angry person")}>Sarcastic Person</Button>
            </ButtonGroup>
            <h2>Ready to order?</h2>
            <Button variant="contained" onClick={handleSubmit}>All ready!</Button>
            {/* <h2>Original Text</h2>
            <h3>{text || "no text"}</h3>
            <h2>{persona || "no one selected yet"}</h2>
            <h3>{summary || "no summary yet"}</h3> */}
            <div className="story-cards">
                {articles.map((article) => (
                    <Story 
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