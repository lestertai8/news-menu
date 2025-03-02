# general python packages
# need for env variables
import os
import json

# OpenAI
from openai import OpenAI

# FastAPI
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# import functions
import news_func



# Guide for using FastAPI: https://www.youtube.com/watch?v=iWS9ogMPOI0
app = FastAPI()


# how to use react with fastapi. see 11:30 in video
# https://www.youtube.com/watch?v=aSdVU9-SxH4

# this is the url of the frontend
origins = [
    "https://lestertai8.github.io",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
]

# if this doesn't work, use allow_origins=["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# example from the video
@app.get("/")
def root():
    return {"Hello": "World"}


# ------------------------------------
# Summarization Function

# model for summary call
class SummaryCall(BaseModel):
    persona: str
    text: str

# example summarization from OpenAI website
# https://platform.openai.com/docs/examples/default-summarize
@app.post("/summary")
def summarize_text(body: SummaryCall):
    # initialize the llm
    client = OpenAI()

    response = client.chat.completions.create(
        # use gpt-4o-mini to save on api calls
        model="gpt-4o-mini",
        messages=[
            {
            "role": "system",
            "content": f"""
            You are {body.persona}. Make it obvious that you are this persona, but also try to maintain the facts given in the text.
            Summarize the given text with the expected tonality, style of writing, and point of view. 
            Summarize the story to be read in 1 minute, using average reading speed (200 wpm) as the calculator."""
            },
            {
            "role": "user",
            "content": body.text
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1
    )

    summarized_text = response.choices[0].message.content

    print(summarized_text)
    return {"summary": summarized_text}


# ------------------------------------
# Quiz Generation Function
# model for quiz call
class QuizCall(BaseModel):
    text: str

# how to format openai responses as JSON
# https://platform.openai.com/docs/guides/structured-outputs#json-mode
@app.post("/quiz")
def generate_quiz(body: QuizCall):
    client = OpenAI()

    class QuizQuestion(BaseModel):
        question: str
        possible_answers: list[str]
        answer: str

    # class Quiz(BaseModel):
    #     list[QuizQuestion]


    response = client.beta.chat.completions.parse(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": f"You are an expert at writing quiz questions that best summarize a given text."},
        {
        "role": "user",
        "content": f"""
        Create a question for {body.text}. The question should be a multiple choice question with 3 options: A, B, and C. Indicate the correct answer too.
        """
        }
    ],
    temperature=0.5,
    max_tokens=256,
    top_p=1,
    response_format=QuizQuestion
    )

    quiz = response.choices[0].message.parsed

    # print(quiz)
    return(quiz)
# ---------------------------------------------
# TTS Function: https://platform.openai.com/docs/guides/text-to-speech

class TTSCall(BaseModel):
    text: str

@app.post("/tts")
def tts(body: TTSCall):
    client = OpenAI()
    speech_file_path = "../frontend/news-menu/public/speech.mp3"
    response = client.audio.speech.create(
        model="tts-1",
        voice="sage",
        input=body.text
    )
    response.stream_to_file(speech_file_path)

    return speech_file_path
# --------------------------------
# Find articles

class ArticleCall(BaseModel):
    category: str
    time: int
    persona: str

@app.post("/articles")
def articles(body: ArticleCall):
    articles = news_func.retrieve_news(body.category, body.time, body.persona)
    # print(news)
    # articles now holds an array of NewsArticle objects. we need to create a json object to send
    # obj.__dict__ converts the object to a dictionary?
    return {"news": [article.__dict__ for article in articles]}
# --------------------------------
# Chatbot
# prompt engineering guide: https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api

class ChatCall(BaseModel):
    context: str
    chat_history: list
    new_persona: str
    input: str

@app.post("/chat")
def chat(body: ChatCall):
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=body.chat_history + 
        [{"role": "system", "content": f"""
          ### Persona:
          You are now {body.new_persona}. 
          Adjust your response according to this persona. 

          ### Task:
          Keep your response to 2 sentences and respond in a way that encourages discussion and follow-up questions.
          Since you are responding to the previous message, connect it to the previous message too.

          ### Context:
          Keep this for reference and cite a piece of it -- even if small -- in your response: {body.context}.
          """}] +
        [{"role": "user", "content": body.input}],
        temperature=0.5,
        max_tokens=256,
        top_p=1
    )

    msg = response.choices[0].message.content

    return {
        "raw": {"role": "assistant", "content": msg},
        "parsed": msg
    }
# --------------------------------
# Prompts for chatbot
class PromptCall(BaseModel):
    context: str
    chat_history: list

@app.post("/prompt")
def prompt(body: PromptCall):
    client = OpenAI()

    class PromptOutput(BaseModel):
        prompts: list[str]

    response = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=body.chat_history + 
        [{"role": "system", "content": f"""
          Create 2 follow-up questions given the chat history and this text: {body.context}. 
          Keep the questions very brief and neutral, yet thought-provoking.
          Keep the question open-ended.
          Prioritize making the question relevant to the previous "assistant" response.
          """}],
        temperature=0.5,
        max_tokens=256,
        top_p=1,
        response_format=PromptOutput
    )

    return response.choices[0].message.parsed


# --------------------------------
# --------------------------------
# this will not reload the server when saving the file
# for development... The below line allows refreshing
# `uvicorn server:app --reload`
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)