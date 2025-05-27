from pydantic import BaseModel
from typing import List


class QueryRequest(BaseModel):
    query: str
class SalaryRequest(BaseModel):
    skills: List[str]
    location: str