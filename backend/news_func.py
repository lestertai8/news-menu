import os
import requests
import newspaper
from openai import OpenAI

# News API
# hopefully github doesn't cry abt it
if not os.getenv("NEWS_API_KEY"):
    os.environ["NEWS_API_KEY"] = "MXoI1cBrjZZLvp5kfwXqZKZ1bUclXVFuaUfLcd0j"

# create a news article class
class NewsArticle:
    def __init__(self, title, date, text, image_url, url, source, summary):
        self.title = title
        self.date = date
        self.text = text
        self.image = image_url
        self.url = url
        self.source = source
        self.summary = summary

# Newspaper4k: https://newspaper4k.readthedocs.io/en/latest/
# this simply gets text from a url
def scrape_news(url):
    article = newspaper.article(url)
    return article.text

# use this to get summaries for news stories
def summarize_text(text, persona):
    # initialize the llm
    client = OpenAI()

    response = client.chat.completions.create(
        # use gpt-4o-mini to save on api calls
        model="gpt-4o-mini",
        messages=[
            {
            "role": "system",
            "content": f"""
            You are {persona}. 
            Summarize the given text with the expected tonality, style of writing, and point of view. 
            Summarize the story to be read in 1 minute, using average reading speed (200 wpm) as the calculator."""
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



def retrieve_news(category, num_articles, persona):
    endpoint = "https://api.thenewsapi.com/v1/news/top"


    # limit = num articles
    params = {
        "api_token": os.getenv("NEWS_API_KEY"),
        "locale": "us",
        "limit": num_articles,
        "categories": [category]
    }
    # Supported categories: general | science | sports | business | health | entertainment | tech | politics | food | travel

    res = requests.get(endpoint, params=params)
    body = res.json()

    # check this out: https://www.thenewsapi.com/documentation
    articles = body["data"]
    # print(articles)

    articles_array = []
    # len(articles) is equal to the 'limit' param
    # we need to build an array of article objects
    for i in range(len(articles)):
        articles_array.append(NewsArticle(
            articles[i]["title"],
            articles[i]["published_at"],
            scrape_news(articles[i]["url"]),
            articles[i]["image_url"],
            articles[i]["url"],
            articles[i]["source"],
            summarize_text(scrape_news(articles[i]["url"]), persona)
        ))
    # print(articles_array[0].text)

    # for i in range(len(articles)):
    #     print(articles[i]["title"])
    #     print(articles[i]["description"])
    #     print(articles[i]["url"])
    #     print(articles[i]["image_url"])

    # url_array = []
    # for i in range(len(articles)):
    #     url_array.append(articles[i]["url"])

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