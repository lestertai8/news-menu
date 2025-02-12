import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useState } from 'react';
import "./StartPage.css";
import api from "../../api.js";


// tutorial on audio in react app
// https://www.youtube.com/watch?v=U1T_J6Odoqg


function StartPage() {
    const [persona, setPersona] = useState("");
    const [time, setTime] = useState("");
    const [text, setText] = useState("");
    const [summary, setSummary] = useState("");
    // const [quiz, setQuiz] = useState("");

    // set the persona when the button is clicked
    const handleButtonName = (name) => {
        setPersona(name);
        // console.log(name);
    }

    // set the time when the button is clicked
    const handleButtonTime = (time) => {
        setTime(time);
        // console.log(time);
    }

    const handleSubmit = async () => {
        try {
            const story = "Once there was a little piggy who lived in a house made of straw. One day, a big bad wolf came along and blew it down.";
            setText(story);
            const response = await api.post("/summary", {persona: persona, text: text});
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error getting summary:", error);
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
            <h2>Who will your server be?</h2>
            <ButtonGroup variant="contained" aria-label="Basic button group">
                {/* Source: used ChatGPT to generate some examples of personas */}
                <Button onClick={() => handleButtonName("Elon Musk")}>Elon Musk</Button>
                <Button onClick={() => handleButtonName("William Shakespeare")}>William Shakespeare</Button>
                <Button onClick={() => handleButtonName("Conspiracy Theorist")}>Conspiracy Theorist</Button>
                <Button onClick={() => handleButtonName("Donald Trump")}>Donald Trump</Button>
            </ButtonGroup>
            <h2>Ready to order?</h2>
            <Button variant="contained" onClick={handleSubmit}>All ready!</Button>
            <h2>Original Text</h2>
            <h3>{text || "no text"}</h3>
            <h2>{persona || "no one selected yet"}</h2>
            <h3>{summary || "no summary yet"}</h3>
        </div>
    );
}

export default StartPage;