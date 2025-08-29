import redis
from dotenv import load_dotenv
import os

load_dotenv()

class RedisDB:
    def __init__(self):
        self.client = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), db=os.getenv("REDIS_DB"), decode_responses=True)

    def setex_client(self, key, value, timeout):
        self.client.setex(key, timeout, value)

    def get_client(self, key):
        return self.client.get(key)

    def delete_client(self, key):
        self.client.delete(key)