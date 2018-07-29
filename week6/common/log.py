import logging

logger = None
logger_format = '%(asctime)s - %(message)s'
logging.basicConfig(format=logger_format)
def setCategory(category):
    global logger
    logger = logging.getLogger(category)

def Info(content):
    global logger
    logger.setLevel(logging.INFO)
    logger.info(content)

def Debug(content):
    global logger
    logger.setLevel(logging.DEBUG)
    logger.debug(content)



