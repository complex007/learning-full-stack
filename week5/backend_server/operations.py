import sys
import os
import json
from bson.json_util import dumps

sys.path.append(os.path.join(os.path.dirname(__file__),'utils'))
import log 
import mongodb_client

log.setCategory('operations')

# use this funtion for testing
def add(num1, num2):
    log.Debug("add is called with %d and %d" %( num1, num2))
    return num1 + num2

def getOneNews():
    log.Info("GetOneNews is called.")
    res = mongodb_client.get_db()['news'].find_one()
    result = dumps(res)
    return json.loads(result)