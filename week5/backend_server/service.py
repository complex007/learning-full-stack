import logging
from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer


SERVER_HOST = 'localhost'
SERVER_PORT = 4040
LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format=LOGGER_FORMAT)
LOGGER = logging.getLogger('backend_service')
LOGGER.setLevel(logging.DEBUG)

# use this funtion for testing
def add(num1, num2):
    LOGGER.debug("add is called with %d and %d", num1, num2)
    return num1 + num2

# Threading RPC Server
RPC_SERVER = SimpleJSONRPCServer((SERVER_HOST, SERVER_PORT))
# expose the add API. map add function to 'add' API
RPC_SERVER.register_function(add, 'add')
LOGGER.info("Starting RPC server on %s:%d", SERVER_HOST, SERVER_PORT)

RPC_SERVER.serve_forever()