# import logging
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
import sys
import os

from bson.json_utils import dumps

sys.path.append(os.path.join(os.path.dirname(__file__),'utils'))

import log 
import mongo_client

SERVER_HOST = 'localhost'
SERVER_PORT = 4040

log.setCategory('backend_service')

# use this funtion for testing
def add(num1, num2):
    log.Debug("add is called with %d and %d" %( num1, num2))
    return num1 + num2

def getOneNews():
    log.Info("GetOneNews is called.")
    res = mongo_client.get_db()['news'].find_one()
    return json.load(dumps(res))

# Threading RPC Server
RPC_SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
# expose the add API. map add function to 'add' API
RPC_SERVER.register_function(add, 'add')
RPC_SERVER.register_function(getOneNews, 'getOneNews')

log.Info("Starting RPC server on %s:%d" %( SERVER_HOST, SERVER_PORT))

RPC_SERVER.serve_forever()