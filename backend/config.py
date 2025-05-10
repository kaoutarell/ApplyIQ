import os
from dotenv import load_dotenv

load_dotenv()  # if using .env file

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
