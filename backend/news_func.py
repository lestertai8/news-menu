import os
import requests
import newspaper
from openai import OpenAI
from pydantic import BaseModel

# News API

# create a news article class
class NewsArticle:
    def __init__(self, title, date, text, image_url, url, source, summary, quiz_question, quiz_choices, quiz_answer):
        self.title = title
        self.date = date
        self.text = text
        self.image = image_url
        self.url = url
        self.source = source
        self.summary = summary
        self.quiz_question = quiz_question
        self.quiz_choices = quiz_choices
        self.quiz_answer = quiz_answer

# Newspaper4k: https://newspaper4k.readthedocs.io/en/latest/
# this simply gets text from a url
def scrape_news(url):
    article = newspaper.article(url)
    return article.text

# use this to get summaries for news stories
def summarize_text(text, persona, persona_description):
    # initialize the llm
    client = OpenAI()

    # Source: got help from chatgpt in improving my prompting: "check out this code snippet i have.
    #  i want this chat completion to take a persona name/description and summarize a news article with interjections from their point of view.
    #  how do i adjust this prompt?"
    # this prompt is from chatgpt

    response = client.chat.completions.create(
        # use gpt-4o-mini to save on api calls
        model="gpt-4o-mini",
        messages=[
            {
            "role": "system",
            "content": f"""
            You are {persona}.
            Here's a description that you should keep in mind for your response: {persona_description}
            Your task is to summarize the given news text while **actively interjecting** with reactions, opinions, or rhetorical questions that align with your persona's style, knowledge, and beliefs.
            
            - Maintain the factual integrity of the news.
            - Summarize the story to be read in 1 minute (approximately 200 words).
            - Add brief but engaging **commentary, humor, skepticism, excitement, or frustration** where appropriate.
            - Keep a natural flow between summary and persona-driven interjections.
            - At the end of the summary, reflect on the news story and its implications to things relevant to your description.
            """
            },
            {
            "role": "user",
            "content": text
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1
    )

    summarized_text = response.choices[0].message.content

    return summarized_text



def generate_quiz(text):
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
        Create a question for {text}. The question should be a multiple choice question with 3 options: A, B, and C. Indicate the correct answer as a letter: either "A" "B" or "C".
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



def retrieve_news(category, num_articles, persona, persona_description, headline, search):
    articles_array = []
    # endpoint = "https://api.thenewsapi.com/v1/news/top"
    if not search:
        endpoint = "https://newsapi.org/v2/top-headlines"


        # limit = num articles
        params = {
            # "api_token": os.getenv("NEWS_API_KEY"),
            "apiKey": os.getenv("NEWS_API_KEY"),
            # "locale": "us",
            "category": category,
            "country": "us",
            # "limit": num_articles,
            # "q": headline,
            "pageSize": num_articles,
            # "categories": [category]
        }
        # Supported categories: general | science | sports | business | health | entertainment | tech | politics | food | travel

        res = requests.get(endpoint, params=params)
        body = res.json()

        # check this out: https://www.thenewsapi.com/documentation
        articles = body["articles"]
        # print(articles)

        # articles_array = []
        # len(articles) is equal to the 'limit' param
        # we need to build an array of article objects
        for i in range(len(articles)):
            raw_text = scrape_news(articles[i]["url"])
            quiz = generate_quiz(raw_text)
            articles_array.append(NewsArticle(
                articles[i]["title"],
                articles[i]["publishedAt"],
                raw_text,
                articles[i]["urlToImage"],
                articles[i]["url"],
                articles[i]["source"]["name"],
                summarize_text(raw_text, persona, persona_description),
                quiz.question,
                quiz.possible_answers,
                quiz.answer
            ))
    else:
        endpoint = "https://newsapi.org/v2/everything"

        # limit = num articles
        params = {
            "apiKey": os.getenv("NEWS_API_KEY"),
            "q": headline,
            "searchIn": "title",
            "language": "en",
            "pageSize": num_articles,
        }
        # Supported categories: general | science | sports | business | health | entertainment | tech | politics | food | travel

        res = requests.get(endpoint, params=params)
        body = res.json()
        # print(body)

        # check this out: https://www.thenewsapi.com/documentation
        articles = body["articles"]
        # print("WHY ISNT THIS WORKING")
        # print(body["totalResults"])

        # articles_array = []
        # len(articles) is equal to the 'limit' param
        # we need to build an array of article objects
        for i in range(len(articles)):
            raw_text = scrape_news(articles[i]["url"])
            quiz = generate_quiz(raw_text)
            articles_array.append(NewsArticle(
                articles[i]["title"],
                articles[i]["publishedAt"],
                raw_text,
                articles[i]["urlToImage"],
                articles[i]["url"],
                articles[i]["source"]["name"],
                summarize_text(raw_text, persona, persona_description),
                quiz.question,
                quiz.possible_answers,
                quiz.answer
            ))


    return articles_array



# def x_min_news(minutes):
#     text_array = []

#     urls = retrieve_news("sports")
#     for i in range(minutes):
#         text = scrape_news(urls[i])
#         text_array.append(text)

#     # for i in range(len(text_array)):
#     #     print(text_array[i])
#     #     print("\n\n")

#     return text_array

# x_min_news(2)
# retrieve_news("sports")