from dotenv import load_dotenv
import os
load_dotenv()
SERVER_URL = 'localhost'
PORT = '3000'
ENV = 'dev'
API_KEY=  os.getenv('API_KEY')