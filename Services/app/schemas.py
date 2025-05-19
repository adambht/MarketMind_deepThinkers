from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    keyword: str
