import os
import requests
import json

# News API
if not os.getenv("NEWS_API_KEY"):
    os.environ["NEWS_API_KEY"] = "MXoI1cBrjZZLvp5kfwXqZKZ1bUclXVFuaUfLcd0j"

def retrieve_news():
    endpoint = "https://api.thenewsapi.com/v1/news/top"

    # set up the query
    q = f"?q={NEWS_API_KEY}"