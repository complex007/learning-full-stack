from cloudAMQP_client import CloudAMQPClient
ClOUDAMQP_URL = "amqp://mazenwik:z4Eya9CpxocIi_3xw5esvt-RiklxGJi5@spider.rmq.cloudamqp.com/mazenwik"
QUEUE_NAME = "news"

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