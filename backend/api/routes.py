from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest
from services.perplexity import query_perplexity

router = APIRouter()

@router.get("/hello")
def hello():
    return {"message": "Hello from modular FastAPI!"}

@router.post("/search")
async def search(query: QueryRequest):
    try:
        results = query_perplexity(query.query)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
