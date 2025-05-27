from fastapi import APIRouter, HTTPException
from models.schemas import QueryRequest, SalaryRequest
from services.perplexity import query_perplexity
from services.estimate_salary import estimate_salary
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/hello")
def hello():
    return {"message": "Hello from modular FastAPI!"}

#@router.post("/search")
# async def search(query: QueryRequest):
#     try:
#         results = query_perplexity(query.query)
#         return {"results": results}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
@router.post("/search")
async def search(query: QueryRequest):
    try:
        results = query_perplexity(query.query)
        return {
            "results": {
                "skills": results["structured_data"].get("skills", []),
                "requirements": results["structured_data"].get("requirements", []),
                "insights": results["structured_data"].get("insights", []),
                "cards": results.get("cards", [])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/estimate-salary")
async def salary_estimation(request: SalaryRequest):
    skills = request.skills
    location = request.location
    result = estimate_salary(skills, location)
    return JSONResponse(content=result)