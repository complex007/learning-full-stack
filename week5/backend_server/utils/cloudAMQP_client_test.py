from cloundAMQP_client import CloudAMQPClient

ClOUDAMQP_URL = "use your own cloud amqp url"
QUEUE_NAME = "test"

def test_basic():
    client = CloudAMQPClient(ClOUDAMQP_URL, QUEUE_NAME)
    sentMsg = {'test': 'test'}
    client.sendMessage(sentMsg)
    client.sleep(5)
    receivedMsg = client.getMessage()
    assert sentMsg == receivedMsg
    print('test_basic passed.')
if __name__ == "__main__":
    test_basic()