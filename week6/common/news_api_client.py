import requests
import json
NEWS_API_ENDPOINT = "https://newsapi.org/v1/"
NEWS_API_KEY = "8f21ca9c61c8488ba3f11b6ca40ad002"
ARTICILES_API = "articles"

# define constant
CNN = 'cnn'
DEFAULT_SOURCE =[CNN]
SORT_BY_TOP ='top'

def getNewsFromSource(sources=DEFAULT_SOURCE,sortBy=SORT_BY_TOP):
    articles = []
    api = NEWS_API_ENDPOINT+ARTICILES_API
    for newsSource in sources:
        payload ={
            'source':newsSource,
            'apiKey':NEWS_API_KEY,
            'sortBy':sortBy
        }
        response = requests.get( api, params = payload )
        # response.content is a binary
        res_json = json.loads(response.content.decode('utf-8'))
        # extract info from res
        if (res_json is not None 
            and res_json['status'] == 'ok' 
            and res_json['source'] is not None):
            # populate news source in each articles
            for news in res_json['articles']:
                news['source'] = res_json['source']
            # join two list into one list
            articles.extend(res_json['articles'])
    return articles



   