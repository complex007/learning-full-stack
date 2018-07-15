# import logging
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer
import operations
from "./utils" import log

SERVER_HOST = 'localhost'
SERVER_PORT = 4040

log.setCategory('backend_service')

# use this funtion for testing
def add(num1, num2):
    return operations.add(num1, num2)

def getOneNews():
    return operations.getOneNews()

# Threading RPC Server
RPC_SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
# expose the add API. map add function to 'add' API
RPC_SERVER.register_function(add, 'add')
RPC_SERVER.register_function(getOneNews, 'getOneNews')

log.Info("Starting RPC server on %s:%d" %( SERVER_HOST, SERVER_PORT))

RPC_SERVER.serve_forever()