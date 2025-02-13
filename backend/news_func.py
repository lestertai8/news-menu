import os
import requests
import newspaper

# News API
# hopefully github doesn't cry abt it
if not os.getenv("NEWS_API_KEY"):
    os.environ["NEWS_API_KEY"] = "MXoI1cBrjZZLvp5kfwXqZKZ1bUclXVFuaUfLcd0j"

def retrieve_news(category):
    endpoint = "https://api.thenewsapi.com/v1/news/top"


    # limit = num articles
    params = {
        "api_token": os.getenv("NEWS_API_KEY"),
        "locale": "us",
        "limit": 10,
        "categories": [category]
    }
    # Supported categories: general | science | sports | business | health | entertainment | tech | politics | food | travel

    res = requests.get(endpoint, params=params)
    body = res.json()

    # check this out: https://www.thenewsapi.com/documentation
    articles = body["data"]

    # for i in range(len(articles)):
    #     print(articles[i]["title"])
    #     print(articles[i]["description"])
    #     print(articles[i]["url"])
    #     print(articles[i]["image_url"])

    url_array = []
    for i in range(len(articles)):
        url_array.append(articles[i]["url"])

    return url_array


# Newspaper4k: https://newspaper4k.readthedocs.io/en/latest/
def scrape_news(url):
    article = newspaper.article(url)
    return article.text

def x_min_news(minutes):
    text_array = []

    urls = retrieve_news("sports")
    for i in range(minutes):
        text = scrape_news(urls[i])
        text_array.append(text)

    # for i in range(len(text_array)):
    #     print(text_array[i])
    #     print("\n\n")

    return text_array

# x_min_news(2)