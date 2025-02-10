from openai import OpenAI
import os
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Guide for using FastAPI: https://www.youtube.com/watch?v=iWS9ogMPOI0
app = FastAPI()


# how to use react with fastapi. see 11:30 in video
# https://www.youtube.com/watch?v=aSdVU9-SxH4

# this is the url of the frontend
origins = [
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

# set openai api key
# github might yell at me
if not os.getenv("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = "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"


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
            "content": f"You are {body.persona}. Summarize the given text with the expected tonality, style of writing, and point of view."
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


# model for quiz call
class QuizCall(BaseModel):
    persona: str
    summary: str

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
        {"role": "system", "content": f"You are {body.persona} who is amazing at writing quiz questions. Keep this person's style of speaking while writing the question."},
        {
        "role": "user",
        "content": f"""
        Create a question for {body.summary}. The question should be a multiple choice question with 3 options: A, B, and C. Indicate the correct answer too.
        """
        }
    ],
    temperature=0.5,
    max_tokens=256,
    top_p=1,
    response_format=QuizQuestion
    )

    quiz = response.choices[0].message.parsed

    print(quiz)
    return(quiz)


# this will not reload the server when saving the file
# for development... The below line allows refreshing
# `uvicorn server:app --reload`
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)




# EXAMPLE CALLS

# example_text = "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus."
# example_summary = summarize_text("Elon Musk", example_text)
# generate_quiz("Elon Musk", example_summary)