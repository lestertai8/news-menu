import os
import requests
import json

# News API
# hopefully github doesn't cry abt it
if not os.getenv("NEWS_API_KEY"):
    os.environ["NEWS_API_KEY"] = "MXoI1cBrjZZLvp5kfwXqZKZ1bUclXVFuaUfLcd0j"

def retrieve_news():
    endpoint = "https://api.thenewsapi.com/v1/news/top"


    # limit = num articles
    params = {
        "api_token": os.getenv("NEWS_API_KEY"),
        "locale": "us",
        "limit": 1
    }

    res = requests.get(endpoint, params=params)
    body = res.json()

    # check this out: https://www.thenewsapi.com/documentation
    articles = body["data"]

    for i in range(len(articles)):
        print(articles[i]["title"])
        print(articles[i]["description"])
        print(articles[i]["url"])
        print(articles[i]["image_url"])

    return articles

retrieve_news()