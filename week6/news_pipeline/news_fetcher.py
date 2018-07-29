import os
import sys
from newspaper import Article
# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..',
'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))
import cnn_news_scraper
from cloudAMQP_client import CloudAMQPClient
import log
log.setCategory('news_fetcher')


DEDUPE_NEWS_TASK_QUEUE_URL = "amqp://mazenwik:z4Eya9CpxocIi_3xw5esvt-RiklxGJi5@spider.rmq.cloudamqp.com/mazenwik"
DEDUPE_NEWS_TASK_QUEUE_NAME = "news"

SCRAPE_NEWS_TASK_QUEUE_URL = "amqp://voqjfkqc:mSMDkJihFxd9Tc8Q4KuED40o1qijFe0r@mustang.rmq.cloudamqp.com/voqjfkqc"
SCRAPE_NEWS_TASK_QUEUE_NAME = "new-news"

SLEEP_TIME_IN_SECONDS = 5

dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL,DEDUPE_NEWS_TASK_QUEUE_NAME)
scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL,SCRAPE_NEWS_TASK_QUEUE_NAME)

def run():
    while True:
        if scrape_news_queue_client is not None:
            msg = scrape_news_queue_client.getMessage()
        if msg is not None:
            # parse and process the task
            try:
                handle_message(msg)
            except Exception as e:
                log.Debug(e)
                scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)


def handle_message(msg):
    if not isinstance(msg, dict):
        log.Debug('message is broken')
        return
    task = msg
    article = Article(task['url'])
    article.download()
    article.parse()
    task['text'] = article.text.encode('utf-8')
    dedupe_news_queue_client.sendMessage(task)


if __name__ == '__main__':
    run()