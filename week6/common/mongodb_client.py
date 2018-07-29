from pymongo import MongoClient

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = 27017 #default port
DB_NAME = 'demo'

# singleton client:  only one instance of mongodb but it can access different collections
# The singleton pattern is appropriately used when 
# you have an interface 
# and multiple implementations of that interface.
client = MongoClient(MONGO_DB_HOST,MONGO_DB_PORT)

# use db_name as default value of db
def get_db( db = DB_NAME ):
    db = client[db]
    return db